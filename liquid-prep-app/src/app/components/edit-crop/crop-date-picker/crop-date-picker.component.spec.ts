import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropDatePickerComponent } from './crop-date-picker.component';

describe('CropDatePickerComponent', () => {
  let component: CropDatePickerComponent;
  let fixture: ComponentFixture<CropDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropDatePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CropDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
