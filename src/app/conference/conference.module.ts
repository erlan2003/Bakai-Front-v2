import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConferenceComponent } from './conference.component';
import { ConferenceRoutingModule } from './conference-routing.module';

@NgModule({
  declarations: [ConferenceComponent],
  imports: [CommonModule, ConferenceRoutingModule],
})
export class ConferenceModule {}
