import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingMapComponent } from './booking-map.component';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { BookingMapRoutingModule } from './booking-map-routing.module';
import { BookingComponent } from './booking/booking.component';
import { BookingResultDialogComponent } from './booking/booking-result-dialog/booking-result-dialog.component';

@NgModule({
  declarations: [BookingMapComponent, BookingComponent, BookingResultDialogComponent],
  imports: [CommonModule, TranslateModule, SharedModule, FlexLayoutModule, MaterialModule, BookingMapRoutingModule],
})
export class BookingMapModule {}
