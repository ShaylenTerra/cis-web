import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RequestsChartsComponent} from './requests-charts.component';

describe('RequestsChartsComponent', () => {
    let component: RequestsChartsComponent;
    let fixture: ComponentFixture<RequestsChartsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RequestsChartsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RequestsChartsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
