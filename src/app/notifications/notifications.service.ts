import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CredentialsService } from '../auth/credentials.service';

interface AppNotification {
  id: number;
  date: string;
  time: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = localStorage.getItem('apiBaseUrl') || 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  getNotifications(date: string): Observable<AppNotification[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.credentialsService.token}`,
    });

    const url = `${this.apiUrl}`;

    return this.http.get<AppNotification[]>(url, { headers });
  }
}
