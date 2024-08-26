import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '../auth/credentials.service';
import { MatDialog } from '@angular/material/dialog';
import { BookingComponent } from './booking/booking.component';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

export interface Employee {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
}

export interface BookingInfo {
  employee: Employee;
  placeCode: string;
  bookingDate: string;
}

export interface Place {
  id: number;
  code: string;
  locked: boolean;
  hasBooking: boolean;
  bookingInfo?: BookingInfo;
}

@Component({
  selector: 'app-booking-map',
  templateUrl: './booking-map.component.html',
  styleUrls: ['./booking-map.component.scss'],
})
export class BookingMapComponent implements OnInit {
  isTodayActive = true;
  selectedDate: Date = new Date();
  places: Place[] = [];
  filteredPlacesA: Place[] = [];
  filteredPlacesB: Place[] = [];
  filteredPlacesC: Place[] = [];
  filteredPlacesD: Place[] = [];
  filteredPlacesE: Place[] = [];
  filteredPlacesF: Place[] = [];
  filteredPlacesG: Place[] = [];
  filteredPlacesH: Place[] = [];
  filteredPlacesI: Place[] = [];
  filteredPlacesJ_1_2: Place[] = [];
  filteredPlacesJ_3_4: Place[] = [];
  filteredPlacesJ_5_6: Place[] = [];
  filteredPlacesJ_7_8: Place[] = [];
  filteredPlacesJ_9_10: Place[] = [];
  filteredPlacesU: Place[] = [];
  filteredPlacesMeetingRoom: Place[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const dateParam = params['date'];
      this.selectedDate = dateParam ? new Date(dateParam) : new Date();
      this.fetchPlaces();
    });
  }

  openBookingModule(place: Place): void {
    const dialogRef = this.dialog.open(BookingComponent, {
      width: '594px',
      height: '325px',
      data: { selectedPlace: place, selectedDate: this.selectedDate },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Модальное окно закрыто');
      if (result) {
        console.log('Выбранное место:', result);
      }
    });
  }

  fetchPlaces(): void {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8080/api/places?date=${this.formatDate(this.selectedDate)}`;

    this.http.get<Place[]>(url, { headers }).subscribe((places) => {
      this.places = places;
      this.places.forEach((place) => {
        if (place.hasBooking) {
          this.fetchEmployeeInfo(place);
        }
      });

      // Update filtered places
      this.filteredPlacesA = this.places.filter((place) => place.code.startsWith('A'));
      this.filteredPlacesB = this.places.filter((place) => place.code.startsWith('B'));
      this.filteredPlacesC = this.places.filter((place) => place.code.startsWith('С'));
      this.filteredPlacesD = this.places.filter((place) => place.code.startsWith('D'));
      this.filteredPlacesE = this.places.filter((place) => place.code.startsWith('E'));
      this.filteredPlacesF = this.places.filter((place) => place.code.startsWith('F'));
      this.filteredPlacesG = this.places.filter((place) => place.code.startsWith('G'));
      this.filteredPlacesH = this.places.filter((place) => place.code.startsWith('H'));
      this.filteredPlacesI = this.places.filter((place) => place.code.startsWith('I'));
      this.filteredPlacesJ_1_2 = this.places.filter((place) => ['J-1', 'J-2'].includes(place.code));
      this.filteredPlacesJ_3_4 = this.places.filter((place) => ['J-3', 'J-4'].includes(place.code));
      this.filteredPlacesJ_7_8 = this.places.filter((place) => ['J-7', 'J-8'].includes(place.code));
      this.filteredPlacesJ_5_6 = this.places.filter((place) => ['J-5', 'J-6'].includes(place.code));
      this.filteredPlacesJ_9_10 = this.places.filter((place) => ['J-9', 'J-10'].includes(place.code));
      this.filteredPlacesMeetingRoom = this.places.filter((place) => ['meeting-room'].includes(place.code));
    });
  }

  fetchEmployeeInfo(place: Place): void {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8080/api/places/${place.id}?date=${this.formatDate(this.selectedDate)}`;

    this.http.get<{ booking: BookingInfo }>(url, { headers }).subscribe(
      (response) => {
        if (response && response.booking && response.booking.employee) {
          place.bookingInfo = response.booking;
          const { firstName, lastName, middleName } = response.booking.employee;
          console.log(`Забронировавший сотрудник: ${lastName} ${firstName} ${middleName}`);
        } else {
          console.log('Данные о сотруднике не найдены.');
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          console.log(`Место с ID ${place.id} на дату ${this.formatDate(this.selectedDate)} не забронировано.`);
        } else {
          console.error('Ошибка при получении данных о бронировании:', error);
        }
      }
    );
  }

  getPlaceClass(place: Place): string {
    if (place.locked) {
      return 'locked';
    } else if (place.hasBooking) {
      return 'booked';
    } else {
      return 'available';
    }
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

  selectToday(): void {
    this.isTodayActive = true;
    this.selectedDate = new Date();
    this.fetchPlaces();
  }

  selectTomorrow(): void {
    this.isTodayActive = false;
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    this.selectedDate = tomorrow;
    this.fetchPlaces();
  }

  getEmployeeName(place: Place): string {
    if (place.bookingInfo && place.bookingInfo.employee) {
      const { firstName, lastName } = place.bookingInfo.employee;
      const lastNameInitial = lastName ? `${lastName.charAt(0)}.` : '';
      return `${lastNameInitial} ${firstName}`;
    }
    return '';
  }
  getEmployeeNameInitial(place: Place): string {
    if (place.bookingInfo && place.bookingInfo.employee) {
      const { lastName } = place.bookingInfo.employee;
      return lastName ? `${lastName.charAt(0)}` : '';
    }
    return '';
  }
}
