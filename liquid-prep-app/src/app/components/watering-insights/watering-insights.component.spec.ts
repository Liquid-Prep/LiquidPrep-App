import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WateringInsightsComponent } from './watering-insights.component';

describe('WateringInsightsComponent', () => {
  let component: WateringInsightsComponent;
  let fixture: ComponentFixture<WateringInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WateringInsightsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WateringInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
