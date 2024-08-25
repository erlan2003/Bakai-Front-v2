import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService, Employee } from '../employees/employee.service';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from '../profile/profile.component';
import { SettingsComponent } from '@app/settings/settings.component';

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
  buttonsState = [false, false, false, false, false];

  constructor(
    private breakpoint: BreakpointObserver,
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private employeeService: EmployeeService,
    private _dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCurrentEmployee();
    this.setCurrentMonthYear();
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
    if (this.currentEmployee && this.currentEmployee.lastName) {
      this.lastNameInitial = this.currentEmployee.lastName.charAt(0).toUpperCase();
    }
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
    this._dialog.open(ProfileComponent);
  }

  toggleColor(index: number) {
    this.buttonsState = this.buttonsState.map((state, i) => i === index);
  }

  openSettingForm() {
    this._dialog.open(SettingsComponent);
  }
}
