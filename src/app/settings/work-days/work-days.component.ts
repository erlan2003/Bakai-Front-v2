import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WorkDaysService } from '../work-days/work-day.service';
import { MatDialog } from '@angular/material/dialog';
import { CalendarDialogComponent } from './calendar-dialog/calendar-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-work-days',
  templateUrl: './work-days.component.html',
  styleUrls: ['./work-days.component.scss'],
})
export class WorkDaysComponent implements OnInit {
  nonWorkingDays: any[] = [];

  constructor(
    private closedialogRef: MatDialogRef<WorkDaysComponent>,
    private workDaysService: WorkDaysService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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
        this.snackBar.open('Нерабочий день добавлен', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
      },
      (error) => {
        this.snackBar.open('Ошибка при добавлении нерабочего дня', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
      }
    );
  }

  deleteWeekend(date: string): void {
    this.workDaysService.deleteWeekend(date).subscribe(
      (response) => {
        this.snackBar.open('Нерабочий день удалён', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
        this.fetchNonWorkingDays();
      },
      (error) => {
        this.snackBar.open('Ошибка при удалении нерабочего дня', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
        console.error('Ошибка при удалении нерабочего дня:', error);
      }
    );
  }

  protected readonly parseFloat = parseFloat;
}
