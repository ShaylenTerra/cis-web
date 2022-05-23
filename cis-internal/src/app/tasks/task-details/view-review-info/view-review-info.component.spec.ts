import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReviewInfoComponent } from './view-review-info.component';

describe('ViewReviewInfoComponent', () => {
  let component: ViewReviewInfoComponent;
  let fixture: ComponentFixture<ViewReviewInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewReviewInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReviewInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
