import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgementDocumentDialogComponent } from './lodgement-document-dialog.component';

describe('LodgementDocumentDialogComponent', () => {
  let component: LodgementDocumentDialogComponent;
  let fixture: ComponentFixture<LodgementDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodgementDocumentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgementDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
