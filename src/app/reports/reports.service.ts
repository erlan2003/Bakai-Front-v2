import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/auth/credentials.service';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private apiUrl = 'bookings/places';

  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  getReports(from: string, to: string, FIO?: string, positionId?: number, teamId?: number): Observable<any> {
    const token = this.credentialsService.token;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
    let params = `?from=${from}&to=${to}`;
    if (FIO) params += `&FIO=${FIO}`;
    if (positionId) params += `&positionId=${positionId}`;
    if (teamId) params += `&teamId=${teamId}`;
    return this.http.get<any>(`${this.apiUrl}/stats${params}`, { headers });
  }

  downloadReport(from: string, to: string, FIO?: string, positionId?: number, teamId?: number): Observable<Blob> {
    const token = this.credentialsService.token;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
    let params = `?from=${from}&to=${to}`;
    if (FIO) params += `&FIO=${FIO}`;
    if (positionId) params += `&positionId=${positionId}`;
    if (teamId) params += `&teamId=${teamId}`;

    return this.http.get(`${this.apiUrl}/report${params}`, {
      headers,
      responseType: 'blob', // Важно: получаем данные в виде Blob
    });
  }
}
