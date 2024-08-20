import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '../auth/credentials.service';

export interface Place {
  id: number;
  code: string;
  locked: boolean;
  hasBooking: boolean;
}

@Component({
  selector: 'app-booking-map',
  templateUrl: './booking-map.component.html',
  styleUrls: ['./booking-map.component.scss'],
})
export class BookingMapComponent implements OnInit {
  selectedDate: Date = new Date();
  places: Place[] = [];
  filteredPlacesA: Place[] = [];
  filteredPlacesB: Place[] = [];
  filteredPlacesC: Place[] = [];
  filteredPlacesE: Place[] = [];
  filteredPlacesF: Place[] = [];
  filteredPlacesD: Place[] = [];
  filteredPlacesG: Place[] = [];
  filteredPlacesH: Place[] = [];
  filteredPlacesI: Place[] = [];
  filteredPlacesJ_1_2: Place[] = [];
  filteredPlacesJ_3_4: Place[] = [];
  filteredPlacesJ_7_8: Place[] = [];
  filteredPlacesJ_5_6: Place[] = [];
  filteredPlacesJ_9_10: Place[] = [];
  filteredPlacesU: Place[] = [];
  filteredPlacesMeetingRoom: Place[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const dateParam = params['date'];
      this.selectedDate = dateParam ? new Date(dateParam) : new Date();
      this.fetchPlaces();
    });
  }

  fetchPlaces(): void {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `places?date=${this.formatDate(this.selectedDate)}`;

    this.http.get<Place[]>(url, { headers }).subscribe((places) => {
      this.places = places;
      this.filteredPlacesA = this.places.filter((place) => place.code.startsWith('A'));
      this.filteredPlacesB = this.places.filter((place) => place.code.startsWith('B'));
      this.filteredPlacesC = this.places.filter((place) => place.code.startsWith('С'));
      this.filteredPlacesD = this.places.filter((place) => place.code.startsWith('D'));
      this.filteredPlacesE = this.places.filter((place) => place.code.startsWith('E'));
      this.filteredPlacesF = this.places.filter((place) => place.code.startsWith('F'));
      this.filteredPlacesG = this.places.filter((place) => place.code.startsWith('G'));
      this.filteredPlacesH = this.places.filter((place) => place.code.startsWith('H'));
      this.filteredPlacesI = this.places.filter((place) => place.code.startsWith('I'));
      this.filteredPlacesU = this.places.filter((place) => place.code.startsWith('U'));
      this.filteredPlacesJ_1_2 = this.places.filter((place) => ['J-1', 'J-2'].includes(place.code));
      this.filteredPlacesJ_3_4 = this.places.filter((place) => ['J-3', 'J-4'].includes(place.code));
      this.filteredPlacesJ_7_8 = this.places.filter((place) => ['J-7', 'J-8'].includes(place.code));
      this.filteredPlacesJ_5_6 = this.places.filter((place) => ['J-5', 'J-6'].includes(place.code));
      this.filteredPlacesJ_9_10 = this.places.filter((place) => ['J-9', 'J-10'].includes(place.code));
      this.filteredPlacesMeetingRoom = this.places.filter((place) => ['meeting-room'].includes(place.code));
    });
  }

  getPlaceClass(place: Place): string {
    if (place.locked) {
      return 'locked';
    } else if (place.hasBooking) {
      return 'booked';
    } else {
      return 'available';
    }
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

  selectToday(): void {
    this.selectedDate = new Date();
    this.fetchPlaces();
  }

  selectTomorrow(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.selectedDate = tomorrow;
    this.fetchPlaces();
  }
}
