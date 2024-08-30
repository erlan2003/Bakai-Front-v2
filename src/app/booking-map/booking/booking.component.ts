import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Place } from '../booking-map.component';
import { CredentialsService } from '../../auth/credentials.service';
import { MatDialog } from '@angular/material/dialog';
import { BookingResultDialogComponent } from '../booking/booking-result-dialog/booking-result-dialog.component'; // Импортируем новый компонент

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  selectedPlaceId: number;
  allPlaces: Place[] = [];
  selectedPlace: Place | undefined;
  selectedDate: Date;
  isWork: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BookingComponent>,
    private http: HttpClient,
    private credentialsService: CredentialsService,
    private dialog: MatDialog // Внедряем MatDialog
  ) {
    this.selectedPlaceId = data.selectedPlace?.id;
    this.selectedDate = data.selectedDate;
  }

  ngOnInit(): void {
    this.fetchAllPlaces();
  }

  fetchAllPlaces(): void {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = 'places'; // URL для получения всех мест

    this.http.get<Place[]>(url, { headers }).subscribe(
      (places) => {
        this.allPlaces = places;
        // Устанавливаем выбранное место на основе идентификатора
        this.selectedPlace = this.allPlaces.find((place) => place.id === this.selectedPlaceId);
      },
      (error) => {
        console.error('Ошибка при загрузке мест:', error);
      }
    );
  }

  onPlaceChange(newPlace: Place): void {
    this.selectedPlace = newPlace;
  }

  sendBooking(): void {
    if (!this.selectedPlace || !this.selectedDate) {
      console.error('Не выбрано место или дата');
      return;
    }

    const formattedDate = this.formatDate(this.selectedDate);

    const bookingData = {
      placeId: this.selectedPlace.id,
      bookingDate: formattedDate,
    };

    console.log('Отправка данных бронирования:', bookingData);

    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = 'bookings/places';

    this.http.post(url, bookingData, { headers }).subscribe(
      (response) => {
        console.log('Бронирование успешно:', response);
        this.openMessageDialog('Место успешно забронировано');
        // window.location.reload();
      },
      (error) => {
        console.error('Ошибка при бронировании:', error);
        let errorMessage = 'Неизвестная ошибка';
        if (error.error && error.error.errors && error.error.errors.length > 0) {
          errorMessage = error.error.errors[0].errorMessage;
        } else if (error.error && error.error.code === 'invalidBookingDate') {
          errorMessage = 'Нельзя создать бронь на прошедшую или текущую дату';
        }
        this.openMessageDialog(errorMessage);
      }
    );
  }

  // Метод для форматирования даты вручную
  formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

  // Метод для открытия диалога с сообщением
  openMessageDialog(message: string): void {
    this.dialog
      .open(BookingResultDialogComponent, {
        width: '334px',
        height: '176px',
        data: { message },
      })
      .afterClosed()
      .subscribe(() => {
        // this.dialogRef.close();
        // window.location.reload();
      });
  }

  selectWork(): void {
    this.isWork = true;
  }

  selectMeeting(): void {
    this.isWork = false;
  }
}
