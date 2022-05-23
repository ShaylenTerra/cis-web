import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WfStudioComponent} from './wf-studio.component';

describe('WfStudioComponent', () => {
    let component: WfStudioComponent;
    let fixture: ComponentFixture<WfStudioComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WfStudioComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WfStudioComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
