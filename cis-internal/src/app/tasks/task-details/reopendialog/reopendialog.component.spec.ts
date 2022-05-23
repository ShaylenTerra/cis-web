import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReopendialogComponent} from './reopendialog.component';

describe('ReopendialogComponent', () => {
    let component: ReopendialogComponent;
    let fixture: ComponentFixture<ReopendialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReopendialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReopendialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
