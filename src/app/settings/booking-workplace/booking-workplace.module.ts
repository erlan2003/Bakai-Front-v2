import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingWorkplaceRoutingModule } from './booking-workplace-routing.module';
import { BookingWorkplaceComponent } from './booking-workplace.component';

@NgModule({
  declarations: [BookingWorkplaceComponent],
  imports: [CommonModule, BookingWorkplaceRoutingModule, FormsModule],
})
export class BookingWorkplaceModule {}
