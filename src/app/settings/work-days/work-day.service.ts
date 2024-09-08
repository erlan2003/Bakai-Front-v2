import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/auth/credentials.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WorkDaysService {
  private apiUrl = localStorage.getItem('apiBaseUrl') || '';

  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  getNonWorkingDays(): Observable<any> {
    const token = this.credentialsService.token; // Получение токена из credentialsService
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    return this.http.get<any>(`${this.apiUrl}weekends`, { headers });
  }

  addNonWorkingDay(data: any): Observable<any> {
    const token = this.credentialsService.token;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    return this.http.post<any>(`${this.apiUrl}/weekends`, data, { headers });
  }
}
