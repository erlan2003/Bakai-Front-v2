import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CredentialsService } from '@app/auth/credentials.service';

@Component({
  selector: 'app-booking-workplace',
  templateUrl: './booking-workplace.component.html',
  styleUrls: ['./booking-workplace.component.scss'],
})
export class BookingWorkplaceComponent implements OnInit {
  bookingOpenTime: string = ''; // Время начала бронирования
  bookingCloseTime: string = ''; // Время окончания бронирования
  daysAhead: number = 0; // Количество дней вперед
  openTimeId: number = 0;
  closeTimeId: number = 0;
  daysAheadSettingId: number = 0;

  isEditingDaysAhead: boolean = false; // Флаг для режима редактирования

  private apiUrl = localStorage.getItem('apiBaseUrl') || '';

  constructor(
    private http: HttpClient,
    private credentialsService: CredentialsService,
    private closedialogRef: MatDialogRef<BookingWorkplaceComponent>
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

    this.http.get(`${this.apiUrl}application-settings`, { headers }).subscribe(
      (settings: any) => {
        const openTimeSetting = settings.find((s: any) => s.key === 'BOOKING_OPEN_TIME');
        const closeTimeSetting = settings.find((s: any) => s.key === 'BOOKING_CLOSE_TIME');
        const daysAheadSetting = settings.find((s: any) => s.key === 'BOOKING_PLACES_ALLOWED_DAYS_AHEAD');

        if (openTimeSetting) {
          this.bookingOpenTime = openTimeSetting.value;
          this.openTimeId = openTimeSetting.id;
        }

        if (closeTimeSetting) {
          this.bookingCloseTime = closeTimeSetting.value;
          this.closeTimeId = closeTimeSetting.id;
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

    // Обновляем время открытия
    if (this.bookingOpenTime) {
      this.http
        .patch(`${this.apiUrl}application-settings/${this.openTimeId}`, { value: this.bookingOpenTime }, { headers })
        .subscribe(
          () => {
            console.log('Время открытия обновлено');
          },
          (error) => {
            console.error('Ошибка обновления времени открытия:', error);
          }
        );
    }

    // Обновляем время закрытия
    if (this.bookingCloseTime) {
      this.http
        .patch(`${this.apiUrl}application-settings/${this.closeTimeId}`, { value: this.bookingCloseTime }, { headers })
        .subscribe(
          () => {
            console.log('Время закрытия обновлено');
          },
          (error) => {
            console.error('Ошибка обновления времени закрытия:', error);
          }
        );
    }

    // Обновляем количество дней вперед
    if (this.daysAhead) {
      this.http
        .patch(
          `${this.apiUrl}application-settings/${this.daysAheadSettingId}`,
          { value: this.daysAhead.toString() },
          { headers }
        )
        .subscribe(
          () => {
            console.log('Количество дней вперед обновлено');
          },
          (error) => {
            console.error('Ошибка обновления количества дней вперед:', error);
          }
        );
    }
  }

  // Сохраняем количество дней вперед при потере фокуса
  saveDaysAhead(): void {
    const token = this.credentialsService.token;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    // Проверяем, чтобы число было больше нуля
    if (this.daysAhead < 1) {
      this.daysAhead = 1; // Устанавливаем минимальное значение 1
    }

    this.http
      .patch(
        `${this.apiUrl}application-settings/${this.daysAheadSettingId}`,
        { value: this.daysAhead.toString() },
        { headers }
      )
      .subscribe(
        () => {
          console.log('Количество дней вперед обновлено');
          this.isEditingDaysAhead = false; // Выключаем режим редактирования
        },
        (error) => {
          console.error('Ошибка обновления количества дней вперед:', error);
        }
      );
  }

  // Запрет на ввод отрицательных чисел
  checkForNegative(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }
  validateDaysAhead(): void {
    if (this.daysAhead < 0) {
      this.daysAhead = 0;
    }
  }
}
