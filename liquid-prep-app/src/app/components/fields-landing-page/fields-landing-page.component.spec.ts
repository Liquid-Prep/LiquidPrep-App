import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsLandingPageComponent } from './fields-landing-page.component';

describe('FieldsLandingPageComponent', () => {
  let component: FieldsLandingPageComponent;
  let fixture: ComponentFixture<FieldsLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldsLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
