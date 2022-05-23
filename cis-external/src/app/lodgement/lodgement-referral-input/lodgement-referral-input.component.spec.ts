import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgementReferralInputComponent } from './lodgement-referral-input.component';

describe('LodgementReferralInputComponent', () => {
  let component: LodgementReferralInputComponent;
  let fixture: ComponentFixture<LodgementReferralInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodgementReferralInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgementReferralInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
