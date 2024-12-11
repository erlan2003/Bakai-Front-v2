import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConferenceComponent } from './conference.component';
import { ConferenceRoutingModule } from './conference-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@app/@shared';

@NgModule({
  declarations: [ConferenceComponent],
  imports: [CommonModule, ConferenceRoutingModule, HttpClientModule, SharedModule],
})
export class ConferenceModule {}
