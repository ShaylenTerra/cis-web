import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDraftStepDialogComponent } from './delete-draft-step-dialog.component';

describe('DeleteDraftStepDialogComponent', () => {
  let component: DeleteDraftStepDialogComponent;
  let fixture: ComponentFixture<DeleteDraftStepDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDraftStepDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDraftStepDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
