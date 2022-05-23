import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmDecisionComponent} from './confirm-decision.component';

describe('ConfirmDecisionComponent', () => {
    let component: ConfirmDecisionComponent;
    let fixture: ComponentFixture<ConfirmDecisionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfirmDecisionComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmDecisionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
