import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WorkDaysService } from '../work-days/work-day.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CalendarDialogComponent } from './calendar-dialog/calendar-dialog.component';

@Component({
  selector: 'app-work-days',
  templateUrl: './work-days.component.html',
  styleUrls: ['./work-days.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, WorkDaysComponent],
})
export class WorkDaysComponent implements OnInit {
  nonWorkingDays: any[] = [];

  constructor(
    private closedialogRef: MatDialogRef<WorkDaysComponent>,
    private workDaysService: WorkDaysService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchNonWorkingDays();
  }

  closeDialog(): void {
    this.closedialogRef.close();
  }

  fetchNonWorkingDays(): void {
    this.workDaysService.getNonWorkingDays().subscribe(
      (data) => {
        console.log('Полученные данные:', data);
        this.nonWorkingDays = data;
      },
      (error) => {
        console.error('Ошибка при получении нерабочих дней', error);
      }
    );
  }

  openCalendarDialog(): void {
    const dialogRef = this.dialog.open(CalendarDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.addNonWorkingDay(result);
      }
    });
  }

  addNonWorkingDay(date: Date): void {
    this.nonWorkingDays.push({ date });
    this.workDaysService.addNonWorkingDay({ weekends: [date] }).subscribe(
      (response) => {
        console.log('Нерабочий день добавлен:', response);
      },
      (error) => {
        console.error('Ошибка при добавлении нерабочего дня', error);
      }
    );
  }

  deleteWeekend(date: string): void {
    this.workDaysService.deleteWeekend(date).subscribe(
      (response) => {
        console.log('Team deleted successfully:', response);
        this.fetchNonWorkingDays();
      },
      (error) => {
        console.error('Error deleting team:', error);
      }
    );
  }

  protected readonly parseFloat = parseFloat;
}
