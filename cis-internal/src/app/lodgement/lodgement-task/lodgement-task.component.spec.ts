import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgementTaskComponent } from './lodgement-task.component';

describe('LodgementTaskComponent', () => {
  let component: LodgementTaskComponent;
  let fixture: ComponentFixture<LodgementTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodgementTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgementTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
