import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewProcessComponent } from './review-process.component';

describe('ReviewProcessComponent', () => {
  let component: ReviewProcessComponent;
  let fixture: ComponentFixture<ReviewProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
