import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CredentialsService } from '../auth/credentials.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
  roles: string[];
}

export interface Booking {
  placeId: number;
  bookingDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private currentEmployeeSubject = new BehaviorSubject<Employee | null>(null);
  currentEmployee$ = this.currentEmployeeSubject.asObservable();

  constructor(private http: HttpClient, private credentialsService: CredentialsService) {
    this.loadCurrentEmployee();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Токен недоступен!');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getEmployees(): Observable<Employee[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Employee[]>(`employees`, { headers });
  }

  getCurrentEmployee(): Observable<Employee> {
    const headers = this.getAuthHeaders();
    return this.http.get<Employee>(`employees/me`, { headers });
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
    const headers = this.getAuthHeaders();

    return this.http.put<Employee>(`employees/${id}`, profileData, { headers });
  }

  getTodayBookingsForCurrentEmployee(): Observable<{ bookingDate: string; place: string; id: number }[]> {
    const today = this.formatDate(new Date());

    return this.getCurrentEmployee().pipe(
      switchMap((employee) => {
        if (!employee || !employee.id) {
          throw new Error('Сотрудник не найден или не авторизован!');
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
          throw new Error('Сотрудник не найден или не авторизован!');
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
    const headers = this.getAuthHeaders();

    return this.http.get<any[]>(`bookings/places/stats?from=${date}&to=${date}&employeeId=${employeeId}`, { headers });
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

  deleteTomorrowBooking(bookingId: number): Observable<void> {
    const headers = this.getAuthHeaders();

    return this.http.delete<void>(`bookings/places/${bookingId}`, { headers });
  }

  loadCurrentEmployee() {
    this.getCurrentEmployee().subscribe(
      (employee) => this.currentEmployeeSubject.next(employee),
      (error) => console.error('Ошибка при выборе текущего сотрудника.', error)
    );
  }

  uploadEmployeeAvatar(employeeId: number, formData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post(`employees/${employeeId}/avatar`, formData, { headers }).pipe(
      switchMap(() => this.getCurrentEmployee()),
      tap((employee) => this.currentEmployeeSubject.next(employee))
    );
  }

  registerEmployee(employeeData: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    middleName: string;
    positionId: number;
    teamId: string;
    roles: string[];
  }): Observable<Employee> {
    const headers = this.getAuthHeaders();

    return this.http.post<Employee>(`employees`, employeeData, { headers });
  }

  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(`teams`, { headers: this.getAuthHeaders() });
  }

  getPositions(): Observable<any[]> {
    return this.http.get<any[]>(`positions`, { headers: this.getAuthHeaders() });
  }

  changeEmployeeRole(employeeId: number, roles: string[]): Observable<any> {
    const rolesData = { roles };

    return this.http.put<any>(`employees/${employeeId}/roles`, rolesData, { headers: this.getAuthHeaders() }).pipe(
      tap(() => console.log(`Роли успешно изменены для сотрудника ID: ${employeeId}`)),
      catchError((error: HttpErrorResponse) => {
        console.error('Ошибка при изменении роли сотрудника', error);
        return throwError(error);
      })
    );
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`reset-password`, { email });
  }

  recoverPassword(code: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post(`recover-password`, { code, newPassword, confirmPassword });
  }
}
