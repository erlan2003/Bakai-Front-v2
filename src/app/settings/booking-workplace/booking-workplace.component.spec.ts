import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingWorkplaceComponent } from './booking-workplace.component';

describe('BookingWorkplaceComponent', () => {
  let component: BookingWorkplaceComponent;
  let fixture: ComponentFixture<BookingWorkplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingWorkplaceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingWorkplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
