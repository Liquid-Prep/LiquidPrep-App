import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { AdviceComponent } from "./advice.component";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

describe("AdviceComponent", () => {
    let component: AdviceComponent;
    let fixture: ComponentFixture<AdviceComponent>;
    let mockRouter = {
        navigate: jasmine.createSpy("navigate"),
    };
    const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AdviceComponent],
            imports: [HttpClientModule],
            providers: [{ provide: Router, useValue: routerSpy }],
        }).compileComponents();
        fixture = TestBed.createComponent(AdviceComponent);
        component = fixture.componentInstance;
    }));

    it("should run ngOnInit", () => {
        component.ngOnInit();
        expect(component.ngOnInit).toBeTruthy();
    });
    
    it("should navigate back to my-crops", () => {
        let fixture = TestBed.createComponent(AdviceComponent);
        fixture.detectChanges();
        let component: AdviceComponent = fixture.componentInstance;
        component.backClicked();
        expect(routerSpy).toHaveBeenCalledWith(["/my-crops"]);
    });

    it('should navigate to measure-soil page', () => {
        let fixture = TestBed.createComponent(AdviceComponent);
        fixture.detectChanges();
        let component: AdviceComponent = fixture.componentInstance;
        component.onFabClicked();
        expect(routerSpy).toHaveBeenCalledWith(['/measure-soil']);
    } );

});

