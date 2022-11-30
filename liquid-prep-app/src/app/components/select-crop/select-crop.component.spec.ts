import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SelectCropComponent } from './select-crop.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Crop } from '../../models/Crop';

describe('SelectCropComponent', () => {
  let component: SelectCropComponent;
  let fixture: ComponentFixture<SelectCropComponent>;
  let crop: Crop;

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SelectCropComponent],
        imports: [HttpClientModule],
        providers: [{ provide: Router, useValue: routerSpy }]
      }).compileComponents();
      fixture = TestBed.createComponent(SelectCropComponent);
      component = fixture.componentInstance;
    })
  );

  it('should run ngOnInit', () => {
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  });

  it('should show add crop text', () => {
    const fixture = TestBed.createComponent(SelectCropComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#addCropClass').textContent).toContain(
      'Add a crop'
    );
  });

  it('should run addCrop function', () => {
    crop = new Crop();
    crop.cropName = 'Corn';
    crop.type = 'Grain';
    crop.id = '1';
    let fixture = TestBed.createComponent(SelectCropComponent);
    fixture.detectChanges();
    let component: SelectCropComponent = fixture.componentInstance;
    component.addCrop(crop);
    expect(routerSpy).toHaveBeenCalledWith(['/seed-date/' + crop.id]);
  });
});
