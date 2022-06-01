import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocketExaminationComponent } from './docket-examination.component';

describe('DocketExaminationComponent', () => {
  let component: DocketExaminationComponent;
  let fixture: ComponentFixture<DocketExaminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocketExaminationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocketExaminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
