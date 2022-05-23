import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddtodiaryDialogComponent} from './addtodiary-dialog.component';

describe('AddtodiaryDialogComponent', () => {
    let component: AddtodiaryDialogComponent;
    let fixture: ComponentFixture<AddtodiaryDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddtodiaryDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddtodiaryDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
