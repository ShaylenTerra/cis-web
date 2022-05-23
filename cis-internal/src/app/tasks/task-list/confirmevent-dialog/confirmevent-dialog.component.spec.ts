import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmeventDialogComponent} from './confirmevent-dialog.component';

describe('ConfirmeventDialogComponent', () => {
    let component: ConfirmeventDialogComponent;
    let fixture: ComponentFixture<ConfirmeventDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfirmeventDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmeventDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
