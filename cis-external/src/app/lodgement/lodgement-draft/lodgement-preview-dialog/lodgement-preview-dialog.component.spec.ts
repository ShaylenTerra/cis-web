import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgementPreviewDialogComponent } from './lodgement-preview-dialog.component';

describe('LodgementPreviewDialogComponent', () => {
  let component: LodgementPreviewDialogComponent;
  let fixture: ComponentFixture<LodgementPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodgementPreviewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgementPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
