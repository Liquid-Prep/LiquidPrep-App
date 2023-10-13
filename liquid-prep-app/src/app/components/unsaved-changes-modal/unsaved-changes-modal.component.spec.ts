import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsavedChangesModalComponent } from './unsaved-changes-modal.component';

describe('UnsavedChangesModalComponent', () => {
  let component: UnsavedChangesModalComponent;
  let fixture: ComponentFixture<UnsavedChangesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsavedChangesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsavedChangesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
