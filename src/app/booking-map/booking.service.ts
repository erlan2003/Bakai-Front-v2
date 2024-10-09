import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CredentialsService } from '../auth/credentials.service';

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

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  getCurrentUserBookings(date: Date): Observable<Place[]> {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Токен недоступен!');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formattedDate = this.formatDate(date);

    return this.http
      .get<Place[]>(`places?date=${formattedDate}`, { headers })
      .pipe(map((places) => places.filter((place) => place.hasBooking && place.bookingInfo?.employee.username)));
  }

  getTodayBookings(): Observable<Place[]> {
    const today = new Date();
    return this.getCurrentUserBookings(today);
  }

  getTomorrowBookings(): Observable<Place[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.getCurrentUserBookings(tomorrow);
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }
}
