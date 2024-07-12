import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorTypeAndFieldComponent } from './sensor-type-and-field.component';

describe('SensorTypeAndFieldComponent', () => {
  let component: SensorTypeAndFieldComponent;
  let fixture: ComponentFixture<SensorTypeAndFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorTypeAndFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorTypeAndFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
