import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CarColorService } from '../../shared/services/car-color-service.service';

@Component({
  selector: 'app-three-viewer',
  standalone: true,
  templateUrl: './three-viewer.component.html',
  styleUrls: ['./three-viewer.component.css']
})
export class ThreeViewerComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') private canvasRef!: ElementRef;

  // Scene and Camera
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private loader!: GLTFLoader;
  private controls!: OrbitControls;

  // Properties
  private modelPath = 'assets/models/scene.gltf'; // The path to your GLTF file
  private fov = 50;
  private nearClippingPlane = 0.1;
  private farClippingPlane = 1000;

  // Selected part and color
  private selectedPart: string = 'car';

  // References to materials for easy color updates
  private carMaterial!: THREE.MeshStandardMaterial;
  private brakeDiscMaterials: THREE.MeshStandardMaterial[] = []; // Store multiple brake disc materials
  private seatMaterial!: THREE.MeshStandardMaterial;
  private rimMaterials: THREE.MeshStandardMaterial[] = []; // Store multiple rim materials

  constructor(private carColorService: CarColorService) {}

  ngOnInit(): void {
    this.initScene();
    this.addLighting();
    this.loadModel();

    // Subscribe to part and color changes
    this.carColorService.currentPart.subscribe((part: string) => {
      this.selectedPart = part; // Update the selected part
    });

    this.carColorService.currentColor.subscribe((color: string) => {
      this.changeColorBasedOnPart(color); // Change color based on selected part
    });
  }

  ngAfterViewInit(): void {
    this.initCamera();
    this.initRenderer();
    this.initControls(); // Initialize controls for camera interaction
    this.animate();
  }

  // Scene setup
  private initScene() {
    this.scene = new THREE.Scene();
    // No background color, so it remains transparent
  }

  // Camera setup
  private initCamera() {
    const canvasWidth = this.canvasRef.nativeElement.clientWidth;
    const canvasHeight = this.canvasRef.nativeElement.clientHeight;

    // Position the camera to the left and slightly above the car
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      canvasWidth / canvasHeight,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.set(-3, -3, 3); // Adjust as necessary for your view
    this.camera.lookAt(0, 0, 0); // Look at the center of the scene (car's center)
  }

  // Initialize renderer with a transparent background
  private initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true,
      alpha: true // This makes the background transparent
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvasRef.nativeElement.clientWidth, this.canvasRef.nativeElement.clientHeight);
    this.renderer.setClearColor(0x000000, 0); // Set the background to transparent
  }

  // Initialize OrbitControls for rotating around the model
  private initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0); // Set the target of the controls to the center of the scene (the car)

    // Restrict vertical movement (rotation around the x-axis)
    this.controls.minPolarAngle = 1.3;
    this.controls.maxPolarAngle = 1;

    // Allow horizontal rotation (left to right)
    this.controls.enableDamping = true; // Enable smooth controls
    this.controls.update();
  }

  // Add lighting
  private addLighting() {
    // Ambient light for overall brightness
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Directional light for more intense lighting from one direction
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Increased intensity
    directionalLight.position.set(5, 10, 7.5); // Set light position above and to the right
    this.scene.add(directionalLight);

    // Additional directional light for balance
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight2.position.set(-5, 5, -5); // Set another light from the opposite direction
    this.scene.add(directionalLight2);

    // Optional: Point light for extra lighting effect
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
    pointLight.position.set(0, 5, 5); // Add light in front of the car
    this.scene.add(pointLight);
  }

  // Load the GLTF model and adjust the material properties
  private loadModel() {
    this.loader = new GLTFLoader();
    this.loader.load(this.modelPath, (gltf) => {
      const model = gltf.scene;

      // Traverse through the model and log all mesh parts
      model.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          const mesh = node as THREE.Mesh;
          const material = mesh.material as THREE.MeshStandardMaterial;

          // Log the name and material details of each mesh
          console.log(`Mesh Name: ${mesh.name}`);
          console.log(`Material Name: ${material.name}`);
          console.log(`Mesh Properties:`, mesh);

          // Apply default color to car body parts
          if (
            mesh.name.includes("car_main_paint") || // Car body paint
            mesh.name.includes("TRDEF-Body") // Other body parts
          ) {
            material.color = new THREE.Color(0xffffff); // Default white color for car body
            material.metalness = 0.8; // Adjust metalness
            material.roughness = 0.3; // Adjust roughness

            // Save reference to this material for future color changes
            this.carMaterial = material;
          }

          // Store reference to brake disc materials
          if (mesh.name.toLowerCase().includes("brake_disc")) { // Use lowercase to avoid case mismatch issues
            console.log("Brake Disc Found:", mesh);
            this.brakeDiscMaterials.push(material); // Save all brake disc materials
          }

          // Store reference to seat material
          if (mesh.name.includes("seats")) {
            this.seatMaterial = material;
          }

          // Store reference to rim materials
          if (mesh.name.toLowerCase().includes("rims")) { // Use lowercase to avoid case mismatch issues
            console.log("Rim Found:", mesh);
            this.rimMaterials.push(material); // Save all rim materials
          }
        }
      });

      model.scale.set(1, 1, 1); // Adjust the scale if needed
      this.scene.add(model);
    });
  }

  // Method to change car color
  changeCarColor(color: string) {
    if (!this.carMaterial) return; // Make sure the material exists before trying to change the color

    switch (color) {
      case 'gray':
        this.carMaterial.color.set(0x808080); // Gray
        break;
      case 'white':
        this.carMaterial.color.set(0xffffff); // White
        break;
      case 'red':
        this.carMaterial.color.set(0xff0000); // Red
        break;
      case 'blue':
        this.carMaterial.color.set(0x0000ff); // Blue
        break;
      case 'green':
        this.carMaterial.color.set(0x00ff00); // Green
        break;
      default:
        this.carMaterial.color.set(0xffffff); // Default to white if no match
    }
  }

  // Method to change brake disc color
  changeBrakeDiscColor(color: string) {
    if (this.brakeDiscMaterials.length === 0) return; // Make sure there are brake disc materials

    this.brakeDiscMaterials.forEach((material) => {
      switch (color) {
        case 'gray':
          material.color.set(0x808080); // Gray
          break;
        case 'black':
          material.color.set(0x000000); // Black
          break;
        case 'silver':
          material.color.set(0xc0c0c0); // Silver
          break;
        default:
          material.color.set(0x808080); // Default to gray if no match
      }
    });
  }

  // Method to change seat color
  changeSeatColor(color: string) {
    if (!this.seatMaterial) return; // Make sure the material exists before trying to change the color

    switch (color) {
      case 'brown':
        this.seatMaterial.color.set(0x835440); // Brown
        break;
      case 'white':
        this.seatMaterial.color.set(0xffffff); // White
        break;
      case 'beige':
        this.seatMaterial.color.set(0xd5ba98); // Beige
        break;
      case 'red':
        this.seatMaterial.color.set(0xff6347); // Red (Tomato Red)
        break;
      default:
        this.seatMaterial.color.set(0x835440); // Default to brown if no match
    }
  }

  // Method to change rim color
  private changeRimColor(color: string) {
    if (this.rimMaterials.length === 0) return; // Make sure there are rim materials
  
    this.rimMaterials.forEach((material) => {
      switch (color) {
        case 'gray':
          material.color.set(0x808080); // Gray
          break;
        case 'black':
          material.color.set(0x000000); // Black
          break;
        case 'silver':
          material.color.set(0xc0c0c0); // Silver
          break;
        case 'gold':
          material.color.set(0xffd700); // Gold
          break;
        default:
          material.color.set(0x808080); // Default to gray if no match
      }
      
      // Adjust metalness and roughness if necessary for better effect
      material.metalness = 0.9; // Higher metalness for a shiny look
      material.roughness = 0.2; // Lower roughness for less matte look
      
      // Check for any additional properties
      if ('emissive' in material) {
        material.emissive.set(0x000000); // Remove emissive color
      }
  
      if ('clearcoat' in material) {
        material.clearcoat = 1.0; // Apply a clearcoat if supported
      }
  
      material.needsUpdate = true; // Ensure material is updated in the renderer
    });
  }
  

  // Change color based on selected part
  private changeColorBasedOnPart(color: string) {
    switch (this.selectedPart) {
      case 'car':
        this.changeCarColor(color); // Change car color
        break;
      case 'brake':
        this.changeBrakeDiscColor(color); // Change brake disc color
        break;
      case 'seats':
        this.changeSeatColor(color); // Change seat color
        break;
      case 'rim':
        this.changeRimColor(color); // Change rim color
        break;
      default:
        break;
    }
  }

  // Animation loop
  private animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
