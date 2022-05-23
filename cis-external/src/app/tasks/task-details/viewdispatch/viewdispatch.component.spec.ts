import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewdispatchComponent } from './viewdispatch.component';

describe('ViewdispatchComponent', () => {
  let component: ViewdispatchComponent;
  let fixture: ComponentFixture<ViewdispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewdispatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewdispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
