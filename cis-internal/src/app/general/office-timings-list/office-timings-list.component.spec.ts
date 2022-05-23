import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OfficeTimingsListComponent} from './office-timings-list.component';

describe('OfficeTimingsListComponent', () => {
    let component: OfficeTimingsListComponent;
    let fixture: ComponentFixture<OfficeTimingsListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OfficeTimingsListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OfficeTimingsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
