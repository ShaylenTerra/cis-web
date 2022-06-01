import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationLodgementDetailsComponent } from './examination-lodgement-details.component';

describe('ExaminationLodgementDetailsComponent', () => {
  let component: ExaminationLodgementDetailsComponent;
  let fixture: ComponentFixture<ExaminationLodgementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationLodgementDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminationLodgementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
