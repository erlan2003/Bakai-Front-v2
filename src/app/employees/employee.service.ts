import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/auth/credentials.service';

export interface Employee {
  lastName: string;
  firstName: string;
  middleName: string;
  team: string;
  position: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = localStorage.getItem('apiBaseUrl') || ''; // Получаем базовый URL из localStorage

  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  getEmployees(): Observable<Employee[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.credentialsService.token}`,
    });
    return this.http.get<Employee[]>(`${this.apiUrl}employees`, { headers });
  }

  getCurrentEmployee(): Observable<Employee> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.credentialsService.token}`,
    });
    return this.http.get<Employee>(`${this.apiUrl}employees`, { headers });
  }
}
