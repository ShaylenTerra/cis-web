import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfereeDetailsComponent } from './transferee-details.component';

describe('TransfereeDetailsComponent', () => {
  let component: TransfereeDetailsComponent;
  let fixture: ComponentFixture<TransfereeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransfereeDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfereeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
