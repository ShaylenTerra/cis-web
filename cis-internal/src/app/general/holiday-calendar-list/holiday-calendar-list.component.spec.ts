import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HolidayCalendarListComponent} from './holiday-calendar-list.component';

describe('HolidayCalendarListComponent', () => {
    let component: HolidayCalendarListComponent;
    let fixture: ComponentFixture<HolidayCalendarListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HolidayCalendarListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HolidayCalendarListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
