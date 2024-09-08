import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-calendar-dialog',
  templateUrl: './calendar-dialog.component.html',
  styleUrls: ['./calendar-dialog.component.scss'],
})
export class CalendarDialogComponent {
  selectedDate: Date | null = null;

  constructor(private dialogRef: MatDialogRef<CalendarDialogComponent>) {}

  onDateSelected(date: Date): void {
    this.selectedDate = date;
  }

  confirm(): void {
    this.dialogRef.close(this.selectedDate);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
