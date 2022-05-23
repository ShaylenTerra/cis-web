import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexureTransferComponent } from './annexure-transfer.component';

describe('AnnexureTransferComponent', () => {
  let component: AnnexureTransferComponent;
  let fixture: ComponentFixture<AnnexureTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnexureTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnexureTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
