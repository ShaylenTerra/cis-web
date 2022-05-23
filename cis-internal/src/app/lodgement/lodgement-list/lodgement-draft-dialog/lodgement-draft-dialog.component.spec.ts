import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgementDraftDialogComponent } from './lodgement-draft-dialog.component';

describe('LodgementDraftDialogComponent', () => {
  let component: LodgementDraftDialogComponent;
  let fixture: ComponentFixture<LodgementDraftDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodgementDraftDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgementDraftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
