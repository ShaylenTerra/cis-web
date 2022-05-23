import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgementTaskPreviewComponent } from './lodgement-task-preview.component';

describe('LodgementTaskPreviewComponent', () => {
  let component: LodgementTaskPreviewComponent;
  let fixture: ComponentFixture<LodgementTaskPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodgementTaskPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgementTaskPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
