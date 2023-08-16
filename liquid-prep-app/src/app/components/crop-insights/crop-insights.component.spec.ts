import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropInsightsComponent } from './crop-insights.component';

describe('CropInsightsComponent', () => {
  let component: CropInsightsComponent;
  let fixture: ComponentFixture<CropInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropInsightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CropInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
