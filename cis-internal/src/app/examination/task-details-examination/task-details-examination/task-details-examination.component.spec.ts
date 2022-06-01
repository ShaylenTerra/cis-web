import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsExaminationComponent } from './task-details-examination.component';

describe('TaskDetailsExaminationComponent', () => {
  let component: TaskDetailsExaminationComponent;
  let fixture: ComponentFixture<TaskDetailsExaminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskDetailsExaminationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailsExaminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
