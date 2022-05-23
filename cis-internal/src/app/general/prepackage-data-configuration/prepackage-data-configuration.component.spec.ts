import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrepackageDataConfigurationComponent} from './prepackage-data-configuration.component';

describe('PrepackageDataConfigurationComponent', () => {
    let component: PrepackageDataConfigurationComponent;
    let fixture: ComponentFixture<PrepackageDataConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PrepackageDataConfigurationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PrepackageDataConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
