import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeeConfig1Component} from './fee-config1.component';

describe('FeeConfig1Component', () => {
    let component: FeeConfig1Component;
    let fixture: ComponentFixture<FeeConfig1Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FeeConfig1Component]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeeConfig1Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
