import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgementListComponent } from './lodgement-list.component';

describe('LodgementListComponent', () => {
  let component: LodgementListComponent;
  let fixture: ComponentFixture<LodgementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodgementListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
