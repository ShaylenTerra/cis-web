import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationTransferTaskPreviewComponent } from './reservation-transfer-task-preview.component';

describe('ReservationTransferTaskPreviewComponent', () => {
  let component: ReservationTransferTaskPreviewComponent;
  let fixture: ComponentFixture<ReservationTransferTaskPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationTransferTaskPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationTransferTaskPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
