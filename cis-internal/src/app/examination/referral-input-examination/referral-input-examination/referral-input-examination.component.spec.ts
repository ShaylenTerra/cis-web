import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralInputExaminationComponent } from './referral-input-examination.component';

describe('ReferralInputExaminationComponent', () => {
  let component: ReferralInputExaminationComponent;
  let fixture: ComponentFixture<ReferralInputExaminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralInputExaminationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralInputExaminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
