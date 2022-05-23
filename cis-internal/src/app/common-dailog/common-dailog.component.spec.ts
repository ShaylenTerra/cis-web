import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CommonDailogComponent} from './common-dailog.component';

describe('CommonDailogComponent', () => {
    let component: CommonDailogComponent;
    let fixture: ComponentFixture<CommonDailogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CommonDailogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommonDailogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
