import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgementChartComponent } from './lodgement-chart.component';

describe('LodgementChartComponent', () => {
  let component: LodgementChartComponent;
  let fixture: ComponentFixture<LodgementChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodgementChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgementChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
