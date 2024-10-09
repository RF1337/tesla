import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelXComponent } from './model-x.component';

describe('ModelXComponent', () => {
  let component: ModelXComponent;
  let fixture: ComponentFixture<ModelXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelXComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
