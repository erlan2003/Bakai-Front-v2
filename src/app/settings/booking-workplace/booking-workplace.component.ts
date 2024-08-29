import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-workplace',
  templateUrl: './booking-workplace.component.html',
  styleUrls: ['./booking-workplace.component.scss'],
})
export class BookingWorkplaceComponent implements OnInit {
  constructor(private closedialogRef: MatDialogRef<BookingWorkplaceComponent>) {}

  ngOnInit(): void {}

  closeDialog(): void {
    this.closedialogRef.close();
  }
}
