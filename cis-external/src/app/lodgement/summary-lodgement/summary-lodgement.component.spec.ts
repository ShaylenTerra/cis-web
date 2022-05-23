import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryLodgementComponent } from './summary-lodgement.component';

describe('SummaryLodgementComponent', () => {
  let component: SummaryLodgementComponent;
  let fixture: ComponentFixture<SummaryLodgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryLodgementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryLodgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
