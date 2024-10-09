import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CredentialsService } from '@app/auth/credentials.service';

@Injectable({
  providedIn: 'root',
})
export class ConferenceService {
  constructor(private http: HttpClient, private credentialsService: CredentialsService) {}

  getBookings(meetingRoomId: number, filterStartDate: string, filterEndDate: string) {
    const token = this.credentialsService.token;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    const params = {
      meetingRoomId: meetingRoomId.toString(),
      filterStartDate: filterStartDate,
      filterEndDate: filterEndDate,
    };
    return this.http.get('bookings/rooms/filter', { headers, params });
  }
}
