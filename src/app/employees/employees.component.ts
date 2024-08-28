import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from './employee.service';
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

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(
      (data) => {
        console.log('Employees data from API:', data);
        this.employees = data;
        this.filteredEmployees = data; // Изначально показываем всех сотрудников
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  filterEmployees(): void {
    console.log('Search Query:', this.searchQuery);
    console.log('Selected Team:', this.selectedTeam);

    this.filteredEmployees = this.employees.filter((employee) => {
      const fullName = `${employee.firstName ?? ''} ${employee.lastName ?? ''} ${
        employee.middleName ?? ''
      }`.toLowerCase();
      const matchesName = fullName.includes(this.searchQuery.toLowerCase());
      const matchesTeam =
        (employee.team ?? '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        employee.team === this.selectedTeam;

      console.log(`Employee: ${fullName}, Matches Name: ${matchesName}, Matches Team: ${matchesTeam}`);
      return matchesName || matchesTeam;
    });

    console.log('Filtered Employees:', this.filteredEmployees);
  }
  clearSearch(): void {
    this.searchQuery = ''; // Очистка текста в поле ввода
    this.ngOnInit(); // Перезагрузка данных после очистки
  }
}
