import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSensorComponent } from './edit-sensor.component';

describe('EditSensorComponent', () => {
  let component: EditSensorComponent;
  let fixture: ComponentFixture<EditSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSensorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
