import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from '../employees/employee.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ProfileComponent } from '../profile/profile.component';
import { SettingsComponent } from '@app/settings/settings.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { DialogService } from '@app/sevices/dialog.service';
import { IconService } from '@app/sevices/icon.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  isExpanded = false;
  currentMonthYear: string = '';
  currentEmployee: Employee | null = null;
  isLoading = false;
  lastNameInitial: string = '';
  buttonsState = [true, false, false, false, false];

  constructor(
    private breakpoint: BreakpointObserver,
    private employeeService: EmployeeService,
    public dialog: DialogService,
    private iconService: IconService
  ) {}

  ngOnInit() {
    this.iconService.registerIcons();
    this.loadCurrentEmployee();
    this.setCurrentMonthYear();

    this.setActiveButtonFromStorage();

    this.employeeService.currentEmployee$.subscribe(
      (employee) => {
        this.currentEmployee = employee;
        this.setLastNameInitial();
      },
      (error) => {
        console.error('Ошибка при получении текущего сотрудника', error);
      }
    );
  }

  setActiveButtonFromStorage() {
    const storedIndex = localStorage.getItem('activeButtonIndex');
    if (storedIndex !== null) {
      const index = parseInt(storedIndex, 10);
      if (!isNaN(index) && index >= 0 && index < this.buttonsState.length) {
        this.buttonsState = this.buttonsState.map((_, i) => i === index);
      }
    }
  }

  setCurrentMonthYear() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long' } as const;
    let formattedDate = now.toLocaleDateString('ru-RU', options);

    formattedDate = formattedDate.replace(' г.', '');
    this.currentMonthYear = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
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
    this.lastNameInitial = this.currentEmployee?.lastName?.charAt(0).toUpperCase() || '';
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  getHeadContainerWidth() {
    return this.isExpanded ? 'calc(100% - 169px)' : 'calc(100% - 0px)';
  }

  getHeadContainerMargin() {
    return this.isExpanded ? '169px' : '0px';
  }

  get isMobile(): boolean {
    return this.breakpoint.isMatched(Breakpoints.Small) || this.breakpoint.isMatched(Breakpoints.XSmall);
  }

  openProfileForm() {
    const dialogRef = this.dialog.openDialog(ProfileComponent, {}, '594px');
  }

  openNotificationForm() {
    const dialogRef = this.dialog.openDialog(NotificationsComponent, {});
  }

  toggleColor(index: number) {
    this.buttonsState = this.buttonsState.map((state, i) => i === index);

    localStorage.setItem('activeButtonIndex', index.toString());
  }

  openSettingForm() {
    const dialogRef = this.dialog.openDialog(SettingsComponent, {});
  }

  isAdmin(): boolean {
    return this.currentEmployee?.roles.includes('ROLE_ADMIN') || false;
  }
}
