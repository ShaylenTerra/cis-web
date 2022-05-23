import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgementDocumentComponent } from './lodgement-document.component';

describe('LodgementDocumentComponent', () => {
  let component: LodgementDocumentComponent;
  let fixture: ComponentFixture<LodgementDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodgementDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgementDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
