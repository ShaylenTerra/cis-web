import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RaiseQueryComponent} from './raise-query.component';

describe('RaiseQueryComponent', () => {
  let component: RaiseQueryComponent;
  let fixture: ComponentFixture<RaiseQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaiseQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
