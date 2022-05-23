import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MarkAsPendingComponent} from './mark-as-pending.component';

describe('MarkAsPendingComponent', () => {
    let component: MarkAsPendingComponent;
    let fixture: ComponentFixture<MarkAsPendingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MarkAsPendingComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MarkAsPendingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
