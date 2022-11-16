import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MyCropsComponent } from './my-crops.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'

describe('MyCropsComponent', () => {
  let fixture: ComponentFixture<MyCropsComponent>;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCropsComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: Router, useValue: mockRouter}
       ]
    })
    .compileComponents();   
    // fixture = TestBed.createComponent(MyCropsComponent);
    // router = TestBed.inject(Router)
  }));


  it('should navigate', () => {
    // const component = fixture.componentInstance;
    // const navigateSpy = spyOn(router, "navigateByUrl");
    let fixture = TestBed.createComponent(MyCropsComponent);
    fixture.detectChanges();
    let component: MyCropsComponent = fixture.componentInstance;

    component.fabClicked();
    expect(mockRouter.navigate).toHaveBeenCalledWith('/select-crop');
  });

  

});
