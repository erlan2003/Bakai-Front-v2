import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-work-days',
  templateUrl: './work-days.component.html',
  styleUrls: ['./work-days.component.scss'],
})
export class WorkDaysComponent implements OnInit {
  constructor(private closedialogRef: MatDialogRef<WorkDaysComponent>) {}

  ngOnInit(): void {}

  closeDialog(): void {
    this.closedialogRef.close();
  }
}
