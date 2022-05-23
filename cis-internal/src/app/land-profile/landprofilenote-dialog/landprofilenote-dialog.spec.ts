import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LandprofilenoteDialogComponent} from './landprofilenote-dialog.component';

describe('UserinfoDialogComponent', () => {
    let component: LandprofilenoteDialogComponent;
    let fixture: ComponentFixture<LandprofilenoteDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LandprofilenoteDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LandprofilenoteDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
