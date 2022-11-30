import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => { 
    let component: WelcomeComponent;
    let fixture: ComponentFixture<WelcomeComponent>;
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [WelcomeComponent],
            imports: [HttpClientModule, RouterTestingModule],
            providers: [
                { provide: Router, useValue: routerSpy }
            ]
        })
        .compileComponents();
    }
    ));
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WelcomeComponent],
            imports: [HttpClientModule, RouterTestingModule],
            providers: [
                { provide: Router, useValue: {} }
            ]
        })
        fixture = TestBed.createComponent(WelcomeComponent);
        component = fixture.componentInstance;
    }
    );
    
    it('should run ngOnInit()', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });
    
    it('should create', () => {
        const fixture = TestBed.createComponent(WelcomeComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    }
    );

    it('should see description text', () => {
        const fixture = TestBed.createComponent(WelcomeComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('#descriptionID').textContent).toContain('Only use the amount of water your crops need');
    }
    );
});

     
