import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramDocketComponent } from './diagram-docket.component';

describe('DiagramDocketComponent', () => {
  let component: DiagramDocketComponent;
  let fixture: ComponentFixture<DiagramDocketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagramDocketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramDocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
