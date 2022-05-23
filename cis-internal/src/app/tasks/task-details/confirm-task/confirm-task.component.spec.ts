import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmTaskComponent} from './confirm-task.component';

describe('ConfirmTaskComponent', () => {
    let component: ConfirmTaskComponent;
    let fixture: ComponentFixture<ConfirmTaskComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfirmTaskComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmTaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
