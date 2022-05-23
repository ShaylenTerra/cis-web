import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlsUsersComponent} from './pls-users.component';

describe('PlsUsersComponent', () => {
    let component: PlsUsersComponent;
    let fixture: ComponentFixture<PlsUsersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PlsUsersComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PlsUsersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
