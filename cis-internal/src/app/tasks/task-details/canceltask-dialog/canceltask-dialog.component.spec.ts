import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CanceltaskDialogComponent} from './canceltask-dialog.component';

describe('CanceltaskDialogComponent', () => {
    let component: CanceltaskDialogComponent;
    let fixture: ComponentFixture<CanceltaskDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CanceltaskDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CanceltaskDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
