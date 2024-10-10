import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Place } from '../booking-map.component';
import { CredentialsService } from '../../auth/credentials.service';
import { MatDialog } from '@angular/material/dialog';
import { BookingResultDialogComponent } from '../booking/booking-result-dialog/booking-result-dialog.component'; // Импортируем новый компонент
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConferenceBookingService } from '../conference-booking.service';
import { EmployeeService, Employee } from '../../employees/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  dropdownOpen: boolean = false;
  employees: Employee[] = [];
  selectedEmployees: Employee[] = [];

  private apiUrl = localStorage.getItem('apiBaseUrl') || '';

  selectedPlaceId: number;
  allPlaces: Place[] = [];
  selectedPlace: Place | undefined;
  selectedDate: Date;
  isWork: boolean = true;
  @Output() bookingMapUpdated = new EventEmitter<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BookingComponent>,
    private http: HttpClient,
    private credentialsService: CredentialsService,
    private dialog: MatDialog,
    private conferenceBookingService: ConferenceBookingService,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {
    this.selectedPlaceId = data.selectedPlace?.id;
    this.selectedDate = data.selectedDate;
    this.bookingForm = this.formBuilder.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      meetingRoomId: [1, Validators.required],
      date: ['', Validators.required],
      participants: [this.selectedEmployees.map((emp) => emp.username)],
      topic: ['', Validators.required],
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  submitBooking(): void {
    const startTime = this.bookingForm.value.startTime;
    const endTime = this.bookingForm.value.endTime;

    if (this.bookingForm.valid) {
      const bookingData = {
        ...this.bookingForm.value,
        participants: this.selectedEmployees.map((emp) => emp.username),
      };

      this.conferenceBookingService.bookRoom(bookingData).subscribe({
        next: (response) => {
          this.openMessageDialog('Вы успешно забронировали переговорную комнату!');
          this.dialogRef.close();
          this.bookingMapUpdated.emit();
        },
        error: (error) => {
          this.openMessageDialog(error.message);
        },
      });
    }
  }

  private getErrorMessage(error: any): string {
    if (error && error.error) {
      if (Array.isArray(error.error.errors) && error.error.errors.length > 0) {
        return error.error.errors[0].errorMessage || 'Неизвестная ошибка.';
      }

      if (error.error.message) {
        return error.error.message;
      }
    }
    return 'Произошла ошибка. Попробуйте позже.';
  }

  ngOnInit(): void {
    this.fetchAllPlaces();
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (employees: Employee[]) => {
        this.employees = employees;
      },
      (error) => {
        console.error('Ошибка загрузки сотрудников:', error);
      }
    );
  }

  fetchAllPlaces(): void {
    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Token not available');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = 'places';

    this.http.get<Place[]>(url, { headers }).subscribe(
      (places) => {
        this.allPlaces = places;
        this.selectedPlace = this.allPlaces.find((place) => place.id === this.selectedPlaceId);
      },
      (error) => {
        this.openSnackbar('Ошибка при загрузке мест');
      }
    );
  }

  onPlaceChange(newPlace: Place): void {
    this.selectedPlace = newPlace;
  }

  sendBooking(): void {
    if (!this.selectedPlace || !this.selectedDate) {
      this.openSnackbar('Не выбрано место или дата');
      return;
    }

    const formattedDate = this.formatDate(this.selectedDate);

    const bookingData = {
      placeId: this.selectedPlace.id,
      bookingDate: formattedDate,
    };

    const token = this.credentialsService.token;
    if (!token) {
      throw new Error('Токен не доступен!');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = 'bookings/places';

    this.http.post(url, bookingData, { headers }).subscribe(
      (response) => {
        this.openMessageDialog('Место успешно забронировано');
        this.bookingMapUpdated.emit();
        this.dialogRef.close();
      },
      (error) => {
        let errorMessage = 'Неизвестная ошибка';
        if (error.error && error.error.errors && error.error.errors.length > 0) {
          errorMessage = error.error.errors[0].errorMessage;
        } else if (error.error && error.error.code === 'invalidBookingDate') {
          errorMessage = 'Нельзя создать бронь на прошедшую или текущую дату';
        }
        this.openMessageDialog(errorMessage);
      }
    );
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

  openMessageDialog(message: string): void {
    this.dialog
      .open(BookingResultDialogComponent, {
        width: '334px',
        data: { message },
      })
      .afterClosed()
      .subscribe(() => {});
  }

  selectWork(): void {
    this.isWork = true;
  }

  selectMeeting(): void {
    this.isWork = false;
  }

  onEmployeeChange(event: Event, employee: any) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedEmployees.push(employee);
    } else {
      this.selectedEmployees = this.selectedEmployees.filter((e) => e !== employee);
    }
  }

  openSnackbar(message: string): void {
    this.snackBar.open(message, 'Закрыть', {
      duration: 3000,
    });
  }
}
