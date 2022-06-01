import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationDecisionComponent } from './examination-decision.component';

describe('ExaminationDecisionComponent', () => {
  let component: ExaminationDecisionComponent;
  let fixture: ComponentFixture<ExaminationDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationDecisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminationDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
