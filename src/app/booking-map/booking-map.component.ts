import { Component, OnInit } from '@angular/core';
import { QuoteService } from './quote.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-booking-map',
  templateUrl: './booking-map.component.html',
  styleUrls: ['./booking-map.component.scss'],
})
export class BookingMapComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;

  constructor(
    private quoteService: QuoteService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // this.route.queryParams.subscribe((params) => {
    //   const dateParam = params['date'];
    //   if (dateParam) {
    //     this.selectedDate = new Date(dateParam);
    //   } else {
    //     this.selectedDate = new Date();
    //   }
    //   this.fetchPlaces();
    // });
  }
}
