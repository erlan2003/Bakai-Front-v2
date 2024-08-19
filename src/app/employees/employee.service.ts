import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '../auth/credentials.service';

export interface Position {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  position: Position | null;
  team: Team | null;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  getCurrentEmployee(): Observable<Employee> {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Employee>(`employees/me`, { headers });
  }

  updateEmployee(
    id: number,
    profileData: {
      username: string;
      password: string;
      email: string;
      firstName: string;
      lastName: string;
      middleName: string;
      positionId?: number;
      teamId?: number;
      roles: string[];
    }
  ): Observable<Employee> {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `employees/${id}`;

    return this.http.put<Employee>('profileData', { headers });
  }
}
