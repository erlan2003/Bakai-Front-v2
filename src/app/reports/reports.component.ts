import { Component, OnInit } from '@angular/core';
import { ReportsService } from '@app/reports/reports.service';
import { EmployeeService, Employee, Team } from '../employees/employee.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  employees: any[] = [];
  employeeName: string = '';
  fromDate: string = '';
  toDate: string = '';
  selectedTeam: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  teams: Team[] = [];

  constructor(private employeeService: EmployeeService, private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.loadReports();

    this.employeeService.getTeams().subscribe(
      (teams: Team[]) => {
        this.teams = teams;
      },
      (error: any) => {
        console.error('Error fetching teams', error);
      }
    );
  }

  loadReports(): void {
    const FIO = this.employeeName || '';
    const from = this.fromDate || '2020-01-01';
    const to = this.toDate || '2040-01-01';

    this.reportsService.getReports(from, to, FIO).subscribe(
      (data) => {
        this.employees = data;
        this.filterByTeam();
        this.sortEmployees();
      },
      (error) => {
        console.error('Ошибка при загрузке отчетов:', error);
      }
    );
  }

  sortEmployees(): void {
    const direction = this.sortDirection === 'asc' ? 1 : -1;
    this.employees.sort((a, b) => {
      const fieldA = a.employee[this.sortField]?.toLowerCase() || '';
      const fieldB = b.employee[this.sortField]?.toLowerCase() || '';
      return fieldA > fieldB ? direction : fieldA < fieldB ? -direction : 0;
    });
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortEmployees();
  }

  onDoneClick(): void {
    const teamId = this.selectedTeam ? this.teams.find((team) => team.name === this.selectedTeam)?.id : undefined;

    this.reportsService.getReports(this.fromDate, this.toDate, this.employeeName, undefined, teamId).subscribe(
      (data) => {
        this.employees = data;
        this.sortEmployees();
      },
      (error) => {
        console.error('Ошибка при загрузке отчетов:', error);
      }
    );
  }

  clearSearch(): void {
    this.employeeName = '';
    this.selectedTeam = '';
    this.loadReports();
  }

  downloadReport(): void {
    const FIO = this.employeeName;
    const from = this.fromDate;
    const to = this.toDate;

    this.reportsService.downloadReport(from, to, FIO, undefined).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Ошибка при загрузке отчета:', error);
      }
    );
  }

  filterByTeam(): void {
    console.log('Selected team:', this.selectedTeam);
    console.log('All employees:', this.employees);

    if (this.selectedTeam) {
      this.employees = this.employees.filter((employee) => employee.team?.name === this.selectedTeam);
    }

    console.log('Filtered employees:', this.employees);
  }
}
