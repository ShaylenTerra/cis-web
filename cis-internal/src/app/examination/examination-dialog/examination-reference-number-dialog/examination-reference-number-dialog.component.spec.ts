import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationReferenceNumberDialogComponent } from './examination-reference-number-dialog.component';

describe('ExaminationReferenceNumberDialogComponent', () => {
  let component: ExaminationReferenceNumberDialogComponent;
  let fixture: ComponentFixture<ExaminationReferenceNumberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationReferenceNumberDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminationReferenceNumberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
