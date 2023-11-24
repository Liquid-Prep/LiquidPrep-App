import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterConfirmDialogComponent } from './water-confirm-dialog.component';

describe('WaterConfirmDialogComponent', () => {
  let component: WaterConfirmDialogComponent;
  let fixture: ComponentFixture<WaterConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
