import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentViewDetailsDialogComponent } from './payment-view-details-dialog.component';

describe('PaymentViewDetailsDialogComponent', () => {
  let component: PaymentViewDetailsDialogComponent;
  let fixture: ComponentFixture<PaymentViewDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentViewDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentViewDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
