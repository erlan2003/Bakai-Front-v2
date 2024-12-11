import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@app/@shared';
@NgModule({
  declarations: [SettingsComponent],
  imports: [CommonModule, SettingsRoutingModule, SharedModule],
})
export class SettingsModule {}
