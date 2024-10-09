import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/auth/credentials.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WorkDaysService {
  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  getNonWorkingDays(): Observable<any> {
    const token = this.credentialsService.token;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    return this.http.get<any>(`weekends`, { headers });
  }

  addNonWorkingDay(data: any): Observable<any> {
    const token = this.credentialsService.token;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    return this.http.post<any>(`weekends`, data, { headers });
  }

  deleteWeekend(date: string): Observable<any> {
    console.log('ID DELETE = ', date);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.credentialsService.token}`,
    });
    return this.http.delete(`weekends/${date}`, { headers });
  }
}
