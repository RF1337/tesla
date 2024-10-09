import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadsterComponent } from './roadster.component';

describe('RoadsterComponent', () => {
  let component: RoadsterComponent;
  let fixture: ComponentFixture<RoadsterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoadsterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoadsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
