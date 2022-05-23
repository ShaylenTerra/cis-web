import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChangeprovinceDialogComponent} from './changeprovince-dialog.component';

describe('ChangeprovinceDialogComponent', () => {
    let component: ChangeprovinceDialogComponent;
    let fixture: ComponentFixture<ChangeprovinceDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChangeprovinceDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChangeprovinceDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
