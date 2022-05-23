import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailLodgementComponent } from './task-detail-lodgement.component';

describe('TaskDetailLodgementComponent', () => {
  let component: TaskDetailLodgementComponent;
  let fixture: ComponentFixture<TaskDetailLodgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskDetailLodgementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailLodgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
