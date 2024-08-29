import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BookingWorkplaceComponent } from './booking-workplace/booking-workplace.component';
import { BookingMeetingroomComponent } from './booking-meetingroom/booking-meetingroom.component';
import { WorkDaysComponent } from './work-days/work-days.component';
import { TeamsComponent } from './teams/teams.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  dialogRef: MatDialogRef<any> | null = null;

  constructor(private _dialog: MatDialog, private closedialogRef: MatDialogRef<SettingsComponent>) {}

  ngOnInit(): void {}

  openBooking_WorkplaceForm() {
    this.dialogRef = this._dialog.open(BookingWorkplaceComponent);
  }

  openBooking_MeetingroomForm() {
    this.dialogRef = this._dialog.open(BookingMeetingroomComponent);
  }

  openWork_DaysForm() {
    this.dialogRef = this._dialog.open(WorkDaysComponent);
  }

  openTeams_Form() {
    this.dialogRef = this._dialog.open(TeamsComponent);
  }

  closeDialog(): void {
    this.closedialogRef.close();
  }
}
