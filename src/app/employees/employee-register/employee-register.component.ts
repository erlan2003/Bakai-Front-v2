import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

interface Violation {
  fieldName: string;
  message: string;
}

@Component({
  selector: 'app-employee-register',
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.scss'],
})
export class EmployeeRegisterComponent implements OnInit {
  registrationData = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    middleName: '',
    positionId: null as number | null,
    teamId: null as string | null,
    roles: ['ROLE_USER'],
  };

  positions: any[] = [];
  teams: any[] = [];
  formDirty: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<EmployeeRegisterComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPositions();
    this.loadTeams();
  }

  loadPositions() {
    this.employeeService.getPositions().subscribe((positions) => {
      this.positions = positions;
    });
  }

  loadTeams() {
    this.employeeService.getTeams().subscribe((teams) => {
      this.teams = teams;
    });
  }

  onRegister() {
    if (!this.isFormValid()) {
      return;
    }

    const employeeData = {
      ...this.registrationData,
      positionId: this.registrationData.positionId!,
      teamId: this.registrationData.teamId!,
    };

    this.employeeService.registerEmployee(employeeData).subscribe(
      (response) => {
        this.showMessage(`Сотрудник ${this.registrationData.username} успешно зарегистрирован.`);
        this.dialogRef.close();
      },
      (error: HttpErrorResponse) => {
        let errorMessage: string;

        if (error.error.errors && error.error.errors.length > 0) {
          errorMessage = error.error.errors.map((err: any) => err.errorMessage).join(', ');
        } else {
          errorMessage = 'Произошла ошибка при регистрации.';
        }

        this.showMessage(errorMessage);
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private isFormValid(): boolean {
    return (
      this.registrationData.username.trim() !== '' &&
      this.registrationData.email.trim() !== '' &&
      this.registrationData.firstName.trim() !== '' &&
      this.registrationData.lastName.trim() !== '' &&
      this.registrationData.middleName.trim() !== '' &&
      this.registrationData.positionId !== null &&
      this.registrationData.teamId !== null
    );
  }

  private showMessage(message: string) {
    this.dialog.open(MessageDialogComponent, {
      data: { message },
    });
  }
}
