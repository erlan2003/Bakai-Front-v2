import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingMeetingroomComponent } from './booking-meetingroom.component';

const routes: Routes = [{ path: '', component: BookingMeetingroomComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingMeetingroomRoutingModule {}
