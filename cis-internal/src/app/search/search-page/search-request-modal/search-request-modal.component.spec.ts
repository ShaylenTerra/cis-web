import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchRequestModalComponent} from './search-request-modal.component';

describe('SearchRequestModalComponent', () => {
    let component: SearchRequestModalComponent;
    let fixture: ComponentFixture<SearchRequestModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SearchRequestModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchRequestModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
