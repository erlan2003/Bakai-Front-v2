import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CredentialsService } from '@app/auth/credentials.service'; // Ensure the path to CredentialsService is correct

@Injectable({
  providedIn: 'root',
})
export class ConferenceService {
  private apiUrl = 'http://localhost:8080/api/bookings/rooms/filter'; // Updated API endpoint

  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  getBookings(meetingRoomId: number, filterStartDate: string, filterEndDate: string) {
    const token = this.credentialsService.token; // Get token from CredentialsService
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    // Create query parameters for the date range
    const params = {
      meetingRoomId: meetingRoomId.toString(),
      filterStartDate: filterStartDate,
      filterEndDate: filterEndDate,
    };

    // Send GET request with headers and query params
    return this.http.get(this.apiUrl, { headers, params });
  }
}
