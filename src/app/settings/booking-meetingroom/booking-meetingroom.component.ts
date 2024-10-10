import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CredentialsService } from '@app/auth/credentials.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-booking-meetingroom',
  templateUrl: './booking-meetingroom.component.html',
  styleUrls: ['./booking-meetingroom.component.scss'],
})
export class BookingMeetingroomComponent implements OnInit {
  meetingOpenTime: string = '';
  meetingCloseTime: string = '';
  minMeetingDuration: number = 0;
  maxMeetingDuration: number = 0;
  daysAhead: number = 0;

  openMeetTimeId: number = 0;
  closeMeetTimeId: number = 0;
  minDurationId: number = 0;
  maxDurationId: number = 0;
  daysAheadSettingId: number = 0;

  constructor(
    private closedialogRef: MatDialogRef<BookingMeetingroomComponent>,
    private credentialsService: CredentialsService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  closeDialog(): void {
    this.closedialogRef.close();
  }

  loadSettings(): void {
    const token = this.credentialsService.token;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    this.http.get(`application-settings`, { headers }).subscribe(
      (settings: any) => {
        const openTimeSetting = settings.find((s: any) => s.key === 'BOOKING_ROOMS_ALLOWED_START_TIME');
        const closeTimeSetting = settings.find((s: any) => s.key === 'BOOKING_ROOMS_ALLOWED_END_TIME');
        const minDurationSetting = settings.find(
          (s: any) => s.key === 'BOOKING_ROOMS_ALLOWED_MIN_MEETING_DURATION_MINUTES'
        );
        const maxDurationSetting = settings.find(
          (s: any) => s.key === 'BOOKING_ROOMS_ALLOWED_MAX_MEETING_DURATION_MINUTES'
        );
        const daysAheadSetting = settings.find((s: any) => s.key === 'BOOKING_ROOMS_ALLOWED_DAYS_AHEAD');

        if (openTimeSetting) {
          this.meetingOpenTime = openTimeSetting.value;
          this.openMeetTimeId = openTimeSetting.id;
        }

        if (closeTimeSetting) {
          this.meetingCloseTime = closeTimeSetting.value;
          this.closeMeetTimeId = closeTimeSetting.id;
        }

        if (minDurationSetting) {
          this.minMeetingDuration = minDurationSetting.typedValue;
          this.minDurationId = minDurationSetting.id;
        }

        if (maxDurationSetting) {
          this.maxMeetingDuration = maxDurationSetting.typedValue;
          this.maxDurationId = maxDurationSetting.id;
        }

        if (daysAheadSetting) {
          this.daysAhead = daysAheadSetting.typedValue;
          this.daysAheadSettingId = daysAheadSetting.id;
        }
      },
      (error) => {
        console.error('Ошибка загрузки настроек:', error);
      }
    );
  }

  saveChanges(): void {
    const token = this.credentialsService.token;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    if (this.meetingOpenTime) {
      this.http
        .patch(`application-settings/${this.openMeetTimeId}`, { value: this.meetingOpenTime }, { headers })
        .subscribe(() => {
          this.snackBar.open('Время начала бронирования обновлено', 'Закрыть', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.closeDialog();
        });
    }

    if (this.meetingCloseTime) {
      this.http
        .patch(`application-settings/${this.closeMeetTimeId}`, { value: this.meetingCloseTime }, { headers })
        .subscribe(() => {
          this.snackBar.open('Время окончания бронирования обновлено', 'Закрыть', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.closeDialog();
        });
    }

    if (this.minMeetingDuration) {
      this.http
        .patch(`application-settings/${this.minDurationId}`, { value: this.minMeetingDuration.toString() }, { headers })
        .subscribe(() => {
          this.snackBar.open('Минимальная продолжительность встречи обновлена', 'Закрыть', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.closeDialog();
        });
    }

    if (this.maxMeetingDuration) {
      this.http
        .patch(`application-settings/${this.maxDurationId}`, { value: this.maxMeetingDuration.toString() }, { headers })
        .subscribe(() => {
          this.snackBar.open('Максимальная продолжительность встречи обновлена', 'Закрыть', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.closeDialog();
        });
    }

    if (this.daysAhead >= 0) {
      this.http
        .patch(`application-settings/${this.daysAheadSettingId}`, { value: this.daysAhead.toString() }, { headers })
        .subscribe(() => {
          this.snackBar.open('Количество дней вперед обновлено', 'Закрыть', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.closeDialog();
        });
    }
  }
}
