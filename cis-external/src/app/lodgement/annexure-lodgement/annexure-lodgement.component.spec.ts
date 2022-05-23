import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexureLodgementComponent } from './annexure-lodgement.component';

describe('AnnexureLodgementComponent', () => {
  let component: AnnexureLodgementComponent;
  let fixture: ComponentFixture<AnnexureLodgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnexureLodgementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnexureLodgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
