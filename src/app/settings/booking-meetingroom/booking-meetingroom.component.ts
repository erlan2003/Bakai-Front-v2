import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-meetingroom',
  templateUrl: './booking-meetingroom.component.html',
  styleUrls: ['./booking-meetingroom.component.scss'],
})
export class BookingMeetingroomComponent implements OnInit {
  constructor(private closedialogRef: MatDialogRef<BookingMeetingroomComponent>) {}

  ngOnInit(): void {}
  closeDialog(): void {
    this.closedialogRef.close();
  }
}
