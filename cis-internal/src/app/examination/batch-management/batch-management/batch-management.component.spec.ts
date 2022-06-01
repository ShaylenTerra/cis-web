import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchManagementComponent } from './batch-management.component';

describe('BatchManagementComponent', () => {
  let component: BatchManagementComponent;
  let fixture: ComponentFixture<BatchManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
