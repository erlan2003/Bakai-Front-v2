import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from './employee.service';
import { EmployeeRegisterComponent } from './employee-register/employee-register.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchQuery: string = '';
  selectedTeam: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  temporaryRoles: { [key: number]: string } = {};

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(
      (data: Employee[]) => {
        this.employees = data;
        this.filteredEmployees = data;
      },
      (error: any) => {
        console.error('Error fetching employees', error);
      }
    );
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredEmployees.sort((a, b) => {
      const valueA = (a as any)[field]?.toString().toLowerCase() || '';
      const valueB = (b as any)[field]?.toString().toLowerCase() || '';
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.selectedTeam = '';
    this.filteredEmployees = this.employees;
  }

  filterEmployees() {
    this.filteredEmployees = this.employees.filter((employee) => {
      const query = this.searchQuery.toLowerCase();
      const teamMatches = employee.team?.name.toLowerCase().includes(query);
      const nameMatches =
        employee.firstName.toLowerCase().includes(query) ||
        employee.lastName.toLowerCase().includes(query) ||
        employee.middleName?.toLowerCase().includes(query);

      return nameMatches || teamMatches;
    });

    if (this.selectedTeam) {
      this.filteredEmployees = this.filteredEmployees.filter((employee) => employee.team?.name === this.selectedTeam);
    }
  }

  openEmployeeRegisterForm() {
    const dialogRef = this.dialog.open(EmployeeRegisterComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.loadEmployees();
    });
  }

  private loadEmployees() {
    this.employeeService.getEmployees().subscribe(
      (data: Employee[]) => {
        this.employees = data;
        this.filteredEmployees = data;
      },
      (error: any) => {
        console.error('Error fetching employees', error);
      }
    );
  }

  changeEmployeeRole(employeeId: number, role: string) {
    this.employeeService.getCurrentEmployee().subscribe(
      (currentEmployee) => {
        if (currentEmployee && currentEmployee.id === employeeId) {
          this.openMessageDialog('Изменение роли невозможно', 'Невозможно изменить роль текущего пользователя.');
          return;
        }

        this.employeeService.changeEmployeeRole(employeeId, [role]).subscribe(
          () => {
            this.employees = this.employees.map((employee) =>
              employee.id === employeeId ? { ...employee, roles: [role] } : employee
            );
            this.filteredEmployees = this.filteredEmployees.map((employee) =>
              employee.id === employeeId ? { ...employee, roles: [role] } : employee
            );

            this.openMessageDialog('Успешно', `Роль успешно изменена на ${role} для сотрудника.`);
          },
          (error) => {
            console.error('Ошибка при изменении роли сотрудника', error);
            this.openMessageDialog('Ошибка', 'Ошибка при изменении роли сотрудника.');
          }
        );
      },
      (error) => {
        console.error('Ошибка при получении текущего пользователя', error);
        this.openMessageDialog('Ошибка', 'Ошибка при получении текущего пользователя.');
      }
    );
  }

  openMessageDialog(title: string, message: string): void {
    this.dialog.open(MessageDialogComponent, {
      data: { title: title, message: message },
    });
  }
}
