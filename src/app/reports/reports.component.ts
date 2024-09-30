import { Component, OnInit } from '@angular/core';
import { ReportsService } from '@app/reports/reports.service';

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
  sortDirection: 'asc' | 'desc' = 'asc'; // Порядок сортировки

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    const FIO = this.employeeName || '';
    const from = this.fromDate || '2020-01-01';
    const to = this.toDate || '2040-01-01';

    this.reportsService.getReports(from, to, FIO).subscribe(
      (data) => {
        this.employees = data;
        this.sortEmployees(); // Сортируем данные при загрузке
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
      // Если поле сортировки то же самое, меняем направление сортировки
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc'; // По умолчанию сортируем по возрастанию
    }
    this.sortEmployees(); // Выполняем сортировку
  }

  onDoneClick(): void {
    this.loadReports(); // Обновление данных на основе введенных параметров
  }

  clearSearch(): void {
    this.employeeName = ''; // Очистка текста в поле ввода
    this.loadReports(); // Перезагрузка данных после очистки
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
}
