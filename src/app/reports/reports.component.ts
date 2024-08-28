// import { Component } from '@angular/core';
//
// @Component({
//   selector: 'app-reports', // измените на 'app-reports'
//   templateUrl: './reports.component.html',
//   styleUrls: ['./reports.component.scss'],
// })
// export class ReportsComponent {
//   // измените на ReportsComponent
//   // Добавляем массив employees с примерными данными
//   employees = [
//     {
//       lastName: 'Иванов',
//       firstName: 'Иван',
//       middleName: 'Иванович',
//       team: 'Команда 1',
//       position: 'Должность 1',
//       location: 'Место 1',
//       date: '01.08.2024',
//     },
//     {
//       lastName: 'Петров',
//       firstName: 'Петр',
//       middleName: 'Петрович',
//       team: 'Команда 2',
//       position: 'Должность 2',
//       location: 'Место 2',
//       date: '02.08.2024',
//     },
//     // Добавьте другие данные по необходимости
//   ];
// }

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
        console.log('Полученные данные:', data);
        this.employees = data;
      },
      (error) => {
        console.error('Ошибка при загрузке отчетов:', error);
      }
    );
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
