import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkDaysRoutingModule } from './work-days-routing.module';
import { WorkDaysComponent } from './work-days.component';

@NgModule({
  declarations: [WorkDaysComponent],
  imports: [CommonModule, WorkDaysRoutingModule],
})
export class WorkDaysModule {}
