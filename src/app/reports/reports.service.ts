import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/auth/credentials.service'; // Импортируем CredentialsService

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private apiUrl = 'bookings/places/stats';

  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  getReports(from: string, to: string, FIO?: string, positionId?: number, teamId?: number): Observable<any> {
    // Получаем токен через CredentialsService
    const token = this.credentialsService.token;

    // Создаем заголовки с токеном, если он существует
    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : new HttpHeaders();

    // Формируем параметры запроса
    let params = `?from=${from}&to=${to}`;
    if (FIO) params += `&FIO=${FIO}`;
    if (positionId) params += `&positionId=${positionId}`;
    if (teamId) params += `&teamId=${teamId}`;

    // Выполняем запрос с заголовками
    return this.http.get<any>(`${this.apiUrl}${params}`, { headers });
  }
}
