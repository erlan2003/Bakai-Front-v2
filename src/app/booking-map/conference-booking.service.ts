import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CredentialsService } from '../auth/credentials.service';

@Injectable({
  providedIn: 'root',
})
export class ConferenceBookingService {
  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  bookRoom(bookingData: any): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post<any>('bookings/rooms', bookingData, { headers }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ошибка при бронировании, попробуйте позже.';

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
