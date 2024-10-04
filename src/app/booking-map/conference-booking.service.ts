import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CredentialsService } from '../auth/credentials.service';

@Injectable({
  providedIn: 'root',
})
export class ConferenceBookingService {
  private apiUrl = localStorage.getItem('apiBaseUrl') || 'http://localhost:8080/api/bookings/rooms';

  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  // Метод для получения заголовков с токеном
  private getAuthHeaders(): HttpHeaders {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Метод для бронирования комнаты
  bookRoom(bookingData: any): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post<any>(this.apiUrl, bookingData, { headers }).pipe(catchError(this.handleError));
  }

  // Метод для обработки ошибок
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ошибка при бронировании, попробуйте снова позже.';

    if (error.error && error.error.errors && error.error.errors.length > 0) {
      errorMessage = error.error.errors[0].errorMessage;
    } else if (error.status === 401) {
      errorMessage = 'Ошибка авторизации: токен невалиден или отсутствует.';
    } else if (error.status >= 400 && error.status < 500) {
      errorMessage = 'Некорректный запрос. Проверьте введенные данные.';
    } else if (error.status >= 500) {
      errorMessage = 'Ошибка сервера. Попробуйте позже.';
    }

    console.error(`Ошибка сервера: ${error.status}, сообщение: ${errorMessage}`);

    return throwError(() => new Error(errorMessage));
  }
}
