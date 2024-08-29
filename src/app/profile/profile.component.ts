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
  userBookings: Booking[] = [];
  todayDate: string = '';
  tomorrowDate: string = '';
  todayBookings$: Observable<any> | undefined;
  tomorrowBookings$: Observable<any> | undefined;

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
        console.log('Бронирования на сегодня:', data);
        // Обработка данных для отображения
      },
      (error) => {
        console.error('Ошибка при получении бронирований на сегодня:', error);
      }
    );
  }

  getTomorrowBookings(): void {
    this.tomorrowBookings$ = this.employeeService.getTomorrowBookingsForCurrentEmployee();

    this.tomorrowBookings$.subscribe(
      (data) => {
        console.log('Бронирования на завтра:', data);
        // Обработка данных для отображения
      },
      (error) => {
        console.error('Ошибка при получении бронирований на завтра:', error);
      }
    );
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
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

  // getBookingStats(): void {
  //   // Используем метод с нужными параметрами
  //   this.bookingStats$ = this.employeeService.getBookingStats('2024-08-29', '2024-08-30', 'Эрлан');

  //   // Подписка на Observable для обработки данных или ошибок
  //   this.bookingStats$.subscribe(
  //     (data) => {
  //       console.log('Полученные данные:', data);
  //       // Здесь можно обработать данные, например, присвоить их в переменную для отображения
  //     },
  //     (error) => {
  //       console.error('Ошибка при получении данных:', error);
  //       // Обработка ошибок
  //     }
  //   );
  // }
}
