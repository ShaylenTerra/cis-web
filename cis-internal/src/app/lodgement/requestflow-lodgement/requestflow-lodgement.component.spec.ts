import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestflowLodgementComponent } from './requestflow-lodgement.component';

describe('RequestflowLodgementComponent', () => {
  let component: RequestflowLodgementComponent;
  let fixture: ComponentFixture<RequestflowLodgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestflowLodgementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestflowLodgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
