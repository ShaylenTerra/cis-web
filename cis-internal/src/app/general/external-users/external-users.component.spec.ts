import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExternalUsersComponent} from './external-users.component';

describe('ExternalUsersComponent', () => {
    let component: ExternalUsersComponent;
    let fixture: ComponentFixture<ExternalUsersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExternalUsersComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExternalUsersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
