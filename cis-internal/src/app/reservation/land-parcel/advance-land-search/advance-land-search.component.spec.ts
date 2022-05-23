import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceLandSearchComponent } from './advance-land-search.component';

describe('AdvanceLandSearchComponent', () => {
  let component: AdvanceLandSearchComponent;
  let fixture: ComponentFixture<AdvanceLandSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceLandSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceLandSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
