import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PostqueryDialogComponent} from './postquery-dialog.component';

describe('PostqueryDialogComponent', () => {
  let component: PostqueryDialogComponent;
  let fixture: ComponentFixture<PostqueryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostqueryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostqueryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
