import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared';

@NgModule({
  declarations: [ReportsComponent],
  imports: [CommonModule, ReportsRoutingModule, HttpClientModule, FormsModule, SharedModule],
})
export class ReportsModule {}
