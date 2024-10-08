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
  private apiUrl = localStorage.getItem('apiBaseUrl') || '';
  private currentEmployeeSubject = new BehaviorSubject<Employee | null>(null);
  currentEmployee$ = this.currentEmployeeSubject.asObservable();

  constructor(private http: HttpClient, private credentialsService: CredentialsService) {
    this.loadCurrentEmployee();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getEmployees(): Observable<Employee[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Employee[]>(`${this.apiUrl}employees`, { headers });
  }

  getCurrentEmployee(): Observable<Employee> {
    const headers = this.getAuthHeaders();
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
    const headers = this.getAuthHeaders();
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
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}bookings/places/stats?from=${date}&to=${date}&employeeId=${employeeId}`;

    return this.http.get<any[]>(url, { headers });
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

  deleteTomorrowBooking(bookingId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}bookings/places/${bookingId}`;

    return this.http.delete<void>(url, { headers });
  }

  loadCurrentEmployee() {
    this.getCurrentEmployee().subscribe(
      (employee) => this.currentEmployeeSubject.next(employee),
      (error) => console.error('Error fetching current employee', error)
    );
  }

  uploadEmployeeAvatar(employeeId: number, formData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}employees/${employeeId}/avatar`;

    return this.http.post(url, formData, { headers }).pipe(
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
    const url = `${this.apiUrl}employees`;
    return this.http.post<Employee>(url, employeeData, { headers });
  }

  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}teams`, { headers: this.getAuthHeaders() });
  }

  getPositions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}positions`, { headers: this.getAuthHeaders() });
  }

  // changeEmployeeRole(employeeId: number, role: string): Observable<any> {
  //   const rolesData = { roles: [role] };
  //   return this.http.post<any>(`${this.apiUrl}employees/${employeeId}/roles`, rolesData, { headers: this.getAuthHeaders() });
  // }

  changeEmployeeRole(employeeId: number, roles: string[]): Observable<any> {
    const rolesData = { roles }; // Подготовка данных для отправки
    const url = `${this.apiUrl}employees/${employeeId}/roles`; // URL для изменения роли

    return this.http
      .put<any>(url, rolesData, { headers: this.getAuthHeaders() }) // Используйте PUT
      .pipe(
        tap(() => console.log(`Роли успешно изменены для сотрудника ID: ${employeeId}`)),
        catchError((error: HttpErrorResponse) => {
          console.error('Ошибка при изменении роли сотрудника', error); // Логируем ошибку
          return throwError(error); // Возвращаем ошибку
        })
      );
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email });
  }

  recoverPassword(code: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recover-password`, { code, newPassword, confirmPassword });
  }
}
