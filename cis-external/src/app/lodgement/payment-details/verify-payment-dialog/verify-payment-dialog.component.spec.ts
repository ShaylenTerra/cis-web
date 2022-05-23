import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPaymentDialogComponent } from './verify-payment-dialog.component';

describe('VerifyPaymentDialogComponent', () => {
  let component: VerifyPaymentDialogComponent;
  let fixture: ComponentFixture<VerifyPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyPaymentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
