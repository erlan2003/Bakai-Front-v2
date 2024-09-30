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
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private employeeService: EmployeeService) {}

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
      // Переключение направления сортировки
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Задаем новое поле для сортировки
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
}
