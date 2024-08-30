import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/authentication.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { BookingService, Place } from '../booking-map/booking.service';
import { EmployeeService, Employee, Booking } from '../employees/employee.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  currentEmployee: Employee | null = null;
  userBookingToday: Booking | null = null;
  userBookingTomorrow: Booking | null = null;
  lastNameInitial: string = '';
  isLoading = false;
  selectedSection: 'profile' | 'booking' | 'statistics' = 'profile';
  todayBookings: Place[] = [];
  tomorrowBookings: Place[] = [];
  hasTodayBookings: boolean = true;
  hasTomorrowBookings: boolean = true;
  todayBookings$: Observable<{ bookingDate: string; place: string; id: number }[]> | undefined;
  tomorrowBookings$: Observable<{ bookingDate: string; place: string; id: number }[]> | undefined;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef<ProfileComponent>,
    private employeeService: EmployeeService,
    private bookingService: BookingService
  ) {}

  getTodayBookings(): void {
    this.todayBookings$ = this.employeeService.getTodayBookingsForCurrentEmployee();

    this.todayBookings$.subscribe(
      (data) => {
        this.hasTodayBookings = data.length > 0;
        console.log('Бронирования на сегодня:', data);
      },
      (error) => {
        console.error('Ошибка при получении бронирований на сегодня:', error);
        this.hasTodayBookings = false;
      }
    );
  }

  getTomorrowBookings(): void {
    this.tomorrowBookings$ = this.employeeService.getTomorrowBookingsForCurrentEmployee();

    this.tomorrowBookings$.subscribe(
      (data) => {
        this.hasTomorrowBookings = data.length > 0;
        console.log('Бронирования на завтра:', data);
      },
      (error) => {
        console.error('Ошибка при получении бронирований на завтра:', error);
        this.hasTomorrowBookings = false;
      }
    );
  }

  selectProfile(): void {
    this.selectedSection = 'profile';
  }

  selectBooking(): void {
    this.selectedSection = 'booking';
  }

  selectStatistics(): void {
    this.selectedSection = 'statistics';
  }

  ngOnInit(): void {
    this.loadCurrentEmployee();
    this.getTodayBookings();
    this.getTomorrowBookings();
    this.bookingService.getTodayBookings().subscribe((places) => {
      this.todayBookings = places;
    });

    this.bookingService.getTomorrowBookings().subscribe((places) => {
      this.tomorrowBookings = places;
    });
  }

  loadCurrentEmployee() {
    this.isLoading = true;
    this.employeeService.getCurrentEmployee().subscribe(
      (data) => {
        this.currentEmployee = data;
        this.setLastNameInitial();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching current employee', error);
        this.isLoading = false;
      }
    );
  }

  setLastNameInitial() {
    if (this.currentEmployee && this.currentEmployee.lastName) {
      this.lastNameInitial = this.currentEmployee.lastName.charAt(0).toUpperCase();
    }
  }

  logoutSystem(): void {
    this.authenticationService.logout().subscribe(() => {
      this.router.navigate(['/login'], { replaceUrl: true });
    });
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteBooking(bookingId: number): void {
    if (!bookingId) return;

    this.employeeService.deleteTomorrowBooking(bookingId).subscribe(
      () => {
        console.log('Бронь успешно удалена');
        this.getTomorrowBookings();
      },
      (error) => {
        console.error('Ошибка при удалении брони:', error);
      }
    );
  }
}
