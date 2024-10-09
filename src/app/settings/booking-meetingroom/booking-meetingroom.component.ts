import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CredentialsService } from '@app/auth/credentials.service';

@Component({
  selector: 'app-booking-meetingroom',
  templateUrl: './booking-meetingroom.component.html',
  styleUrls: ['./booking-meetingroom.component.scss'],
})
export class BookingMeetingroomComponent implements OnInit {
  meetingOpenTime: string = ''; // Время начала бронирования
  meetingCloseTime: string = ''; // Время окончания бронирования
  minMeetingDuration: number = 0; // Мин. продолжительность встречи
  maxMeetingDuration: number = 0; // Макс. продолжительность встречи
  daysAhead: number = 0; // Количество дней вперед для бронирования

  openMeetTimeId: number = 0;
  closeMeetTimeId: number = 0;
  minDurationId: number = 0;
  maxDurationId: number = 0;
  daysAheadSettingId: number = 0;

  constructor(
    private closedialogRef: MatDialogRef<BookingMeetingroomComponent>,
    private credentialsService: CredentialsService,
    private http: HttpClient
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
        .subscribe(
          () => console.log('Время начала бронирования обновлено'),
          (error) => console.error(error)
        );
    }

    if (this.meetingCloseTime) {
      this.http
        .patch(`application-settings/${this.closeMeetTimeId}`, { value: this.meetingCloseTime }, { headers })
        .subscribe(
          () => console.log('Время окончания бронирования обновлено'),
          (error) => console.error(error)
        );
    }

    if (this.minMeetingDuration) {
      this.http
        .patch(`application-settings/${this.minDurationId}`, { value: this.minMeetingDuration.toString() }, { headers })
        .subscribe(
          () => console.log('Минимальная продолжительность встречи обновлена'),
          (error) => console.error(error)
        );
    }

    if (this.maxMeetingDuration) {
      this.http
        .patch(`application-settings/${this.maxDurationId}`, { value: this.maxMeetingDuration.toString() }, { headers })
        .subscribe(
          () => console.log('Максимальная продолжительность встречи обновлена'),
          (error) => console.error(error)
        );
    }

    if (this.daysAhead >= 0) {
      this.http
        .patch(`application-settings/${this.daysAheadSettingId}`, { value: this.daysAhead.toString() }, { headers })
        .subscribe(
          () => console.log('Количество дней вперед обновлено'),
          (error) => console.error(error)
        );
    }
  }
}
