import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MyCropsComponent } from './my-crops.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('MyCropsComponent', () => {
  let component: MyCropsComponent;
  let fixture: ComponentFixture<MyCropsComponent>;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCropsComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: Router, useValue: routerSpy}
       ]
    })
    .compileComponents();   
    fixture = TestBed.createComponent(MyCropsComponent);
    component = fixture.componentInstance;
    // router = TestBed.inject(Router)
  }));

  it('should have as title', () => {
  });

  it('should navigate', () => {
    // const component = fixture.componentInstance;
    // const navigateSpy = spyOn(router, "navigateByUrl");
    let fixture = TestBed.createComponent(MyCropsComponent);
    fixture.detectChanges();
    let component: MyCropsComponent = fixture.componentInstance;
    component.fabClicked();
    expect(routerSpy).toHaveBeenCalledWith(['/select-crop']);
  });

  it('tab my crops should navigate to my crops', () => {
    // const component = fixture.componentInstance;
    // const navigateSpy = spyOn(router, "navigateByUrl");
    let fixture = TestBed.createComponent(MyCropsComponent);
    fixture.detectChanges();
    let component: MyCropsComponent = fixture.componentInstance;
    component.tabClicked("My Crops");
    expect(routerSpy).toHaveBeenCalledWith(['/my-crops']);
  });

  it('tab settings should navigate to settings', () => {
    // const component = fixture.componentInstance;
    // const navigateSpy = spyOn(router, "navigateByUrl");
    let fixture = TestBed.createComponent(MyCropsComponent);
    fixture.detectChanges();
    let component: MyCropsComponent = fixture.componentInstance;
    component.tabClicked("Settings");
    expect(routerSpy).toHaveBeenCalledWith(['/settings']);
  });

});
