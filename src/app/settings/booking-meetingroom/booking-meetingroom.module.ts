import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingMeetingroomRoutingModule } from './booking-meetingroom-routing.module';
import { BookingMeetingroomComponent } from './booking-meetingroom.component';

@NgModule({
  declarations: [BookingMeetingroomComponent],
  imports: [CommonModule, BookingMeetingroomRoutingModule],
})
export class BookingMeetingroomModule {}
