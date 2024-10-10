import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../auth/authentication.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { BookingService, Place } from '../booking-map/booking.service';
import { EmployeeService, Employee, Booking } from '../employees/employee.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AvatarComponent } from '../profile/avatar/avatar.component';
import { StateService } from './state.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  employee: Employee | null = null;
  @Output() bookingDeleted = new EventEmitter<void>();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef<ProfileComponent>,
    private employeeService: EmployeeService,
    private bookingService: BookingService,
    private dialog: MatDialog,
    private stateService: StateService,
    private snackBar: MatSnackBar
  ) {}

  getTodayBookings(): void {
    this.todayBookings$ = this.employeeService.getTodayBookingsForCurrentEmployee();

    this.todayBookings$.subscribe(
      (data) => {
        this.hasTodayBookings = data.length > 0;
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

    this.employeeService.currentEmployee$.subscribe(
      (employee) => {
        this.employee = employee;
      },
      (error) => {
        console.error('Ошибка при выборе текущего сотрудника.', error);
      }
    );
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
        console.error('Ошибка при выборе текущего сотрудника.', error);
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

    const snackBarRef = this.snackBar.open('Вы уверены, что хотите удалить эту бронь?', 'Да', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });

    snackBarRef.onAction().subscribe(() => {
      this.employeeService.deleteTomorrowBooking(bookingId).subscribe(
        () => {
          this.stateService.notifyBookingUpdated();
          this.getTomorrowBookings();
        },
        (error) => {
          this.snackBar.open('Ошибка при удалении брони', 'Закрыть', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          console.error('Ошибка при удалении брони:', error);
        }
      );
    });
  }

  openAvatarForm() {
    const dialogRef = this.dialog.open(AvatarComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.loadCurrentEmployee();
      this.stateService.notifyBookingUpdated();
    });
  }
}
