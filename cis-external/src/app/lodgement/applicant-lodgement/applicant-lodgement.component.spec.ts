import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantLodgementComponent } from './applicant-lodgement.component';

describe('ApplicantLodgementComponent', () => {
  let component: ApplicantLodgementComponent;
  let fixture: ComponentFixture<ApplicantLodgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantLodgementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantLodgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
