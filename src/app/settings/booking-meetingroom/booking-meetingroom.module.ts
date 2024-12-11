import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingMeetingroomRoutingModule } from './booking-meetingroom-routing.module';
import { BookingMeetingroomComponent } from './booking-meetingroom.component';
import { SharedModule } from '@app/@shared';

@NgModule({
  declarations: [BookingMeetingroomComponent],
  imports: [CommonModule, BookingMeetingroomRoutingModule, FormsModule, SharedModule],
})
export class BookingMeetingroomModule {}
