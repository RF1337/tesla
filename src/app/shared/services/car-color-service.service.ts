import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarColorService {
  private colorSource = new BehaviorSubject<string>('black'); // Default color is black
  private partSource = new BehaviorSubject<string>('car'); // Default part is car

  currentColor = this.colorSource.asObservable();
  currentPart = this.partSource.asObservable();

  changeColor(color: string) {
    this.colorSource.next(color); // Update the color
  }

  changePart(part: string) {
    this.partSource.next(part); // Update the part
  }
}


/*import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarColorService {
  private selectedPartSource = new BehaviorSubject<string>('car'); // Default selected part is 'car'
  private colorSource = new BehaviorSubject<string>('black'); // Default color is black

  currentPart = this.selectedPartSource.asObservable();
  currentColor = this.colorSource.asObservable();

  // Method to change selected part
  changeSelectedPart(part: string) {
    this.selectedPartSource.next(part); // Update the selected part
  }

  // Method to change color
  changeColor(color: string) {
    this.colorSource.next(color); // Update the color
  }
}
*/