import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastReadingsComponent } from './past-readings.component';

describe('PastReadingsComponent', () => {
  let component: PastReadingsComponent;
  let fixture: ComponentFixture<PastReadingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastReadingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PastReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
