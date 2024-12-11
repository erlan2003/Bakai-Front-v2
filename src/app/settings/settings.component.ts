import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BookingWorkplaceComponent } from './booking-workplace/booking-workplace.component';
import { BookingMeetingroomComponent } from './booking-meetingroom/booking-meetingroom.component';
import { WorkDaysComponent } from './work-days/work-days.component';
import { TeamsComponent } from './teams/teams.component';
import { DialogService } from '@app/sevices/dialog.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(private closedialogRef: MatDialogRef<SettingsComponent>, public dialog: DialogService) {}

  ngOnInit(): void {}

  openBooking_WorkplaceForm() {
    this.closedialogRef.close();
    const dialogRef = this.dialog.openDialog(BookingWorkplaceComponent, {});
  }

  openBooking_MeetingroomForm() {
    this.closedialogRef.close();
    const dialogRef = this.dialog.openDialog(BookingMeetingroomComponent, {});
  }

  openWork_DaysForm() {
    this.closedialogRef.close();
    const dialogRef = this.dialog.openDialog(WorkDaysComponent, {});
  }

  openTeams_Form() {
    this.closedialogRef.close();
    const dialogRef = this.dialog.openDialog(TeamsComponent, {});
  }

  closeDialog(): void {
    this.closedialogRef.close();
  }
}
