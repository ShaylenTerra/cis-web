import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationRequestFlowComponent } from './examination-request-flow.component';

describe('ExaminationRequestFlowComponent', () => {
  let component: ExaminationRequestFlowComponent;
  let fixture: ComponentFixture<ExaminationRequestFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationRequestFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminationRequestFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
