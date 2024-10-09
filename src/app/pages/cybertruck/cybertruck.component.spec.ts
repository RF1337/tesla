import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CybertruckComponent } from './cybertruck.component';

describe('CybertruckComponent', () => {
  let component: CybertruckComponent;
  let fixture: ComponentFixture<CybertruckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CybertruckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CybertruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
