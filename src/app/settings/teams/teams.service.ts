import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/auth/credentials.service';

export interface Team {
  id?: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private apiUrl = localStorage.getItem('apiBaseUrl') || '';

  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  createEmployees(teamData: Team): Observable<Team[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.credentialsService.token}`,
    });
    return this.http.post<Team[]>(`${this.apiUrl}teams`, teamData, { headers });
  }

  getTeams(): Observable<Team[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.credentialsService.token}`,
    });
    return this.http.get<Team[]>(`${this.apiUrl}teams`, { headers });
  }

  deleteTeam(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.credentialsService.token}`,
    });
    return this.http.delete(`${this.apiUrl}teams/${id}`, { headers });
  }

  updateTeam(team: Team): Observable<Team> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.credentialsService.token}`,
    });
    return this.http.put<Team>(`${this.apiUrl}teams/${team.id}`, team, { headers });
  }
}
