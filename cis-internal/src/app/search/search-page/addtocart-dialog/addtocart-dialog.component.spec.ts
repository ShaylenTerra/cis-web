import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtocartDialogComponent } from './addtocart-dialog.component';

describe('AddtocartDialogComponent', () => {
  let component: AddtocartDialogComponent;
  let fixture: ComponentFixture<AddtocartDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddtocartDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddtocartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
