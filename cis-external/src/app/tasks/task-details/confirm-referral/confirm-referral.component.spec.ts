import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmReferralComponent} from './confirm-referral.component';

describe('ConfirmReferralComponent', () => {
    let component: ConfirmReferralComponent;
    let fixture: ComponentFixture<ConfirmReferralComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfirmReferralComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmReferralComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
