import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationDispatchComponent } from './examination-dispatch.component';

describe('ExaminationDispatchComponent', () => {
  let component: ExaminationDispatchComponent;
  let fixture: ComponentFixture<ExaminationDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationDispatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminationDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
