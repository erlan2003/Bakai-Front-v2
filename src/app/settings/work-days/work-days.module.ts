import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { WorkDaysRoutingModule } from './work-days-routing.module';
import { WorkDaysComponent } from './work-days.component';
import { CalendarDialogComponent } from './calendar-dialog/calendar-dialog.component';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from '@app/@shared';
import { MaterialModule } from '@app/material.module';

@NgModule({
  declarations: [WorkDaysComponent, CalendarDialogComponent],
  imports: [CommonModule, WorkDaysRoutingModule, SharedModule, MaterialModule],
  entryComponents: [CalendarDialogComponent],
})
export class WorkDaysModule {}
