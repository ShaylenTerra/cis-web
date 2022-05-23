import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgementConfirmDialogComponent } from './lodgement-confirm-dialog.component';

describe('LodgementConfirmDialogComponent', () => {
  let component: LodgementConfirmDialogComponent;
  let fixture: ComponentFixture<LodgementConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodgementConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgementConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
