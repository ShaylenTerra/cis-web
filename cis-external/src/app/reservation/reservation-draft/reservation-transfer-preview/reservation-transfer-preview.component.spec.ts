import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationTransferPreviewComponent } from './reservation-transfer-preview.component';

describe('ReservationTransferPreviewComponent', () => {
  let component: ReservationTransferPreviewComponent;
  let fixture: ComponentFixture<ReservationTransferPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationTransferPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationTransferPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
