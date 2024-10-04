import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CredentialsService } from '@app/auth/credentials.service'; // Убедитесь, что путь к CredentialsService корректный

@Injectable({
  providedIn: 'root',
})
export class ConferenceService {
  private apiUrl = 'http://localhost:8080/api/bookings/rooms/1';

  constructor(
    private http: HttpClient,
    private credentialsService: CredentialsService // Добавляем CredentialsService
  ) {}

  getBookings() {
    const token = this.credentialsService.token; // Получаем токен из CredentialsService
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    return this.http.get(this.apiUrl, { headers });
  }
}
