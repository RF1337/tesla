import { Component } from '@angular/core';
import { ModelXComponent } from "../model-x/model-x.component";
import { RoadsterComponent } from "../roadster/roadster.component";
import { CybertruckComponent } from "../cybertruck/cybertruck.component";
import { ThreeViewerComponent } from "../../components/three-viewer/three-viewer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ModelXComponent, RoadsterComponent, CybertruckComponent, ThreeViewerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
