import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SeedDateComponent } from './seed-date.component';

fdescribe('SeedDateComponent', () => {
    let component: SeedDateComponent;
    let fixture: ComponentFixture<SeedDateComponent>;
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SeedDateComponent],
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
            declarations: [SeedDateComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: Router, useValue: {} }
            ]
        })
        fixture = TestBed.createComponent(SeedDateComponent);
        component = fixture.componentInstance;
    }
    );
    
    it('should create', () => {
        const fixture = TestBed.createComponent(SeedDateComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    }
    );

    it('should see text selectSeedClass', () => {
        const fixture = TestBed.createComponent(SeedDateComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('#selectSeedClass').textContent).toContain('Select Seed Date');
    } 
    );
});
