import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private bookingUpdatedSource = new Subject<void>();
  bookingUpdated$ = this.bookingUpdatedSource.asObservable();

  notifyBookingUpdated() {
    this.bookingUpdatedSource.next();
  }
}
