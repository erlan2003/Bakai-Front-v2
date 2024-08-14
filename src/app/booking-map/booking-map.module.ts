import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingMapComponent } from './booking-map.component';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { BookingMapRoutingModule } from './booking-map-routing.module';

@NgModule({
  declarations: [BookingMapComponent],
  imports: [CommonModule, TranslateModule, SharedModule, FlexLayoutModule, MaterialModule, BookingMapRoutingModule],
})
export class BookingMapModule {}
