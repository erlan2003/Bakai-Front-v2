import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingMeetingroomComponent } from './booking-meetingroom.component';

describe('BookingMeetingroomComponent', () => {
  let component: BookingMeetingroomComponent;
  let fixture: ComponentFixture<BookingMeetingroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingMeetingroomComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingMeetingroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
