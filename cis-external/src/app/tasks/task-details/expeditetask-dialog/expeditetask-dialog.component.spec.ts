import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExpeditetaskDialogComponent} from './expeditetask-dialog.component';

describe('ExpeditetaskDialogComponent', () => {
    let component: ExpeditetaskDialogComponent;
    let fixture: ComponentFixture<ExpeditetaskDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExpeditetaskDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExpeditetaskDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
