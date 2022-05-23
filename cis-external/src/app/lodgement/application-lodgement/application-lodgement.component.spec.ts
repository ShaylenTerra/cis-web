import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationLodgementComponent } from './application-lodgement.component';

describe('ApplicationLodgementComponent', () => {
  let component: ApplicationLodgementComponent;
  let fixture: ComponentFixture<ApplicationLodgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationLodgementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationLodgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
