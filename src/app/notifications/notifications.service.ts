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
  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  getNotifications(date: string): Observable<AppNotification[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.credentialsService.token}`,
    });

    return this.http.get<AppNotification[]>('notifications', { headers });
  }
}
