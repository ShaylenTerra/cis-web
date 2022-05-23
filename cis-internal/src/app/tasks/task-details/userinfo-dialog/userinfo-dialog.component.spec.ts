import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserinfoDialogComponent} from './userinfo-dialog.component';

describe('UserinfoDialogComponent', () => {
    let component: UserinfoDialogComponent;
    let fixture: ComponentFixture<UserinfoDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserinfoDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserinfoDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
