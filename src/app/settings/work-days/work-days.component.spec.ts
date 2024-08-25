import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDaysComponent } from './work-days.component';

describe('WorkDaysComponent', () => {
  let component: WorkDaysComponent;
  let fixture: ComponentFixture<WorkDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkDaysComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
