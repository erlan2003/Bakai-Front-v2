import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingWorkplaceRoutingModule } from './booking-workplace-routing.module';
import { BookingWorkplaceComponent } from './booking-workplace.component';

@NgModule({
  declarations: [BookingWorkplaceComponent],
  imports: [CommonModule, BookingWorkplaceRoutingModule],
})
export class BookingWorkplaceModule {}
