import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgementDraftComponent } from './lodgement-draft.component';

describe('LodgementDraftComponent', () => {
  let component: LodgementDraftComponent;
  let fixture: ComponentFixture<LodgementDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodgementDraftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgementDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
