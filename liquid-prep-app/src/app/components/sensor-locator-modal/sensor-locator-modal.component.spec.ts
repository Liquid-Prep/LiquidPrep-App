import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorLocatorModalComponent } from './sensor-locator-modal.component';

describe('SensorLocatorModalComponent', () => {
  let component: SensorLocatorModalComponent;
  let fixture: ComponentFixture<SensorLocatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorLocatorModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorLocatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
