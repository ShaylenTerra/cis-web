import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeeConfigComponent} from './fee-config.component';

describe('FeeConfigComponent', () => {
    let component: FeeConfigComponent;
    let fixture: ComponentFixture<FeeConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FeeConfigComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeeConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
