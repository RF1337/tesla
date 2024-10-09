import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarColorService } from '../../shared/services/car-color-service.service';
import { ThreeViewerComponent } from '../../components/three-viewer/three-viewer.component';

@Component({
  selector: 'app-roadster',
  standalone: true,
  imports: [CommonModule, ThreeViewerComponent],
  templateUrl: './roadster.component.html',
  styleUrls: ['./roadster.component.css']
})
export class RoadsterComponent {
  currentBackground = 'bg-roadster';
  showColorOptions = false; // To toggle between part selection and color options
  selectedPart: string = ''; // The currently selected part
  colorOptions: { color: string, bgClass: string }[] = []; // Array to hold color options

  // Define color options for each car part
  partColors: { [key: string]: { color: string, bgClass: string }[] } = {
    car: [
      { color: 'gray', bgClass: 'bg-gray-700' },
      { color: 'white', bgClass: 'bg-white' },
      { color: 'red', bgClass: 'bg-red-600' },
      { color: 'blue', bgClass: 'bg-blue-600' },
      { color: 'green', bgClass: 'bg-green-500' },
    ],
    seats: [
      { color: 'brown', bgClass: 'bg-yellow-700' },
      { color: 'white', bgClass: 'bg-white' },
      { color: 'beige', bgClass: 'bg-yellow-200' },
      { color: 'red', bgClass: 'bg-red-400' },
    ],
    brake: [
      { color: 'gray', bgClass: 'bg-gray-700' },
      { color: 'black', bgClass: 'bg-black' },
      { color: 'silver', bgClass: 'bg-gray-300' },
    ],
    rim: [
      { color: 'gray', bgClass: 'bg-gray-700' },
      { color: 'black', bgClass: 'bg-black' },
      { color: 'silver', bgClass: 'bg-gray-300' },
      { color: 'gold', bgClass: 'bg-yellow-500' },
    ]
  };
  

  constructor(private carColorService: CarColorService) {}

  // Method to select a car part
  selectPart(part: string) {
    this.selectedPart = part;
    this.colorOptions = this.partColors[part]; // Set the color options for the selected part
    this.showColorOptions = true; // Show the color options for the selected part
  }

  // Method to go back to part selection
  goBack() {
    this.selectedPart = '';
    this.showColorOptions = false; // Return to part selection
  }

  // Method to select a color
  selectColor(color: string) {
    this.carColorService.changePart(this.selectedPart); // Set the part to be colored
    this.carColorService.changeColor(color); // Change the color of the selected part
  }
}