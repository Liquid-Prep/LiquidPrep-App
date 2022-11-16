import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MeasureSoilComponent } from './measure-soil.component';    

describe('MeasureSoilComponent', () => {
    let component: MeasureSoilComponent;
    let fixture: ComponentFixture<MeasureSoilComponent>;
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    
    beforeEach(waitForAsync(() => { 
        TestBed.configureTestingModule({
            declarations: [MeasureSoilComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: Router, useValue: routerSpy }
            ]
        })
        .compileComponents();
    }
    ));

    beforeEach(() => { 
        TestBed.configureTestingModule({
            declarations: [MeasureSoilComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: Router, useValue: {} }
            ]
        })
        .compileComponents();
        
        fixture = TestBed.createComponent(MeasureSoilComponent);
        component = fixture.componentInstance;
    } 
    );
    
    it('should create', () => {
        const fixture = TestBed.createComponent(MeasureSoilComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    } 
    );

    it('should see text measureSoilSpan', () => { 
        const fixture = TestBed.createComponent(MeasureSoilComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('#measureSoilSpan').textContent).toContain('Measure Soil');
    })
});
