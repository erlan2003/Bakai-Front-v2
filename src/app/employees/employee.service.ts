import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '../auth/credentials.service';
import { map, switchMap } from 'rxjs/operators';

export interface Position {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  position: Position | null;
  team: Team | null;
  avatar: string;
}

export interface Booking {
  placeId: number;
  bookingDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = localStorage.getItem('apiBaseUrl') || '';

  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  getEmployees(): Observable<Employee[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.credentialsService.token}`,
    });
    return this.http.get<Employee[]>(`${this.apiUrl}employees`, { headers });
  }

  getCurrentEmployee(): Observable<Employee> {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Employee>(`${this.apiUrl}employees/me`, { headers });
  }

  updateEmployee(
    id: number,
    profileData: {
      username: string;
      password: string;
      email: string;
      firstName: string;
      lastName: string;
      middleName: string;
      positionId?: number;
      teamId?: number;
      roles: string[];
    }
  ): Observable<Employee> {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}employees/${id}`;

    return this.http.put<Employee>(url, profileData, { headers });
  }

  getTodayBookingsForCurrentEmployee(): Observable<{ bookingDate: string; place: string; id: number }[]> {
    const today = this.formatDate(new Date());

    return this.getCurrentEmployee().pipe(
      switchMap((employee) => {
        if (!employee || !employee.id) {
          throw new Error('Employee not found or not logged in');
        }
        return this.getBookingStats(today, employee.id);
      }),
      map((bookings) =>
        bookings.map((booking) => ({
          bookingDate: booking.bookingDate,
          place: booking.placeCode || 'Место не определено',
          id: booking.id,
        }))
      )
    );
  }

  getTomorrowBookingsForCurrentEmployee(): Observable<{ bookingDate: string; place: string; id: number }[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = this.formatDate(tomorrow);

    return this.getCurrentEmployee().pipe(
      switchMap((employee) => {
        if (!employee || !employee.id) {
          throw new Error('Employee not found or not logged in');
        }
        return this.getBookingStats(formattedTomorrow, employee.id);
      }),
      map((bookings) =>
        bookings.map((booking) => ({
          bookingDate: booking.bookingDate,
          place: booking.placeCode || 'Место не определено',
          id: booking.id,
        }))
      )
    );
  }

  getBookingStats(date: string, employeeId: number): Observable<any[]> {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}bookings/places/stats?from=${date}&to=${date}&employeeId=${employeeId}`;

    console.log('Запрашиваемый URL:', url);

    return this.http.get<any[]>(url, { headers });
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

  deleteTomorrowBooking(bookingId: number): Observable<void> {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}bookings/places/${bookingId}`;

    return this.http.delete<void>(url, { headers });
  }

  uploadEmployeeAvatar(employeeId: number, file: File): Observable<any> {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    formData.append('avatar', file);

    const url = `${this.apiUrl}employees/${employeeId}/avatar`;

    return this.http.post(url, formData, { headers });
  }
}
