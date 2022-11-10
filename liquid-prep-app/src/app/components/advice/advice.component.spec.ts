import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceComponent } from './advice.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdviceComponent', () => {
  let component: AdviceComponent;
  let fixture: ComponentFixture<AdviceComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should have a title', () => {
  //   const title = fixture.nativeElement.querySelector('h1');
  //   expect(title.textContent).toContain('Advice');
  // });

  it('should navigate by backClicked', () => {
    const spy = spyOn(router, 'navigate');
    component.backClicked();
    expect(spy).toHaveBeenCalled();
  } );
});
