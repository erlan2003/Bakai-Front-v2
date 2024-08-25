import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

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
  constructor(private _dialog: MatDialog, private _form: MatFormFieldModule) {}

  ngOnInit(): void {}

  openBooking_WorkplaceForm() {
    this._dialog.open(BookingWorkplaceComponent);
  }

  openBooking_MeetingroomForm() {
    this._dialog.open(BookingMeetingroomComponent);
  }

  openWork_DaysForm() {
    this._dialog.open(WorkDaysComponent);
  }

  openTeams_Form() {
    this._dialog.open(TeamsComponent);
  }
}
