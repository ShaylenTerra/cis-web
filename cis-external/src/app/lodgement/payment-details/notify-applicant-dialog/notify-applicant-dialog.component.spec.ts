import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyApplicantDialogComponent } from './notify-applicant-dialog.component';

describe('NotifyApplicantDialogComponent', () => {
  let component: NotifyApplicantDialogComponent;
  let fixture: ComponentFixture<NotifyApplicantDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifyApplicantDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyApplicantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
