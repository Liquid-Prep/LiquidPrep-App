import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MoistureLogsComponent } from './moisture-logs.component';

describe('MoistureLogsComponent', () => {
  let component: MoistureLogsComponent;
  let fixture: ComponentFixture<MoistureLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoistureLogsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoistureLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
