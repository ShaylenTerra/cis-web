import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReassignComponent} from './reassign.component';

describe('ReassignComponent', () => {
    let component: ReassignComponent;
    let fixture: ComponentFixture<ReassignComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReassignComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReassignComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
