import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-result-dialog',
  templateUrl: './booking-result-dialog.component.html',
  styleUrls: ['./booking-result-dialog.component.scss'],
})
export class BookingResultDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private dialogRef: MatDialogRef<BookingResultDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
