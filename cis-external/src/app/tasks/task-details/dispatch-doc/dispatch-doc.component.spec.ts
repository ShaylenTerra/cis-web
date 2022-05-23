import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchDocComponent } from './dispatch-doc.component';

describe('DispatchDocComponent', () => {
  let component: DispatchDocComponent;
  let fixture: ComponentFixture<DispatchDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
