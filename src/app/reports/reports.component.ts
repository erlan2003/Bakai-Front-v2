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
  fromDate: string = '2024-08-26';
  toDate: string = '2024-08-26';
  selectedTeam: string = '';

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    const FIO = this.employeeName || 'Admin';
    const from = this.fromDate;
    const to = this.toDate;

    this.reportsService.getReports(from, to, FIO).subscribe(
      (data) => {
        console.log('Полученные данные:', data); // Логирование данных
        this.employees = data; // Присвоение данных массиву employees
      },
      (error) => {
        console.error('Ошибка при загрузке отчетов:', error);
      }
    );
  }
  onDoneClick(): void {
    this.loadReports(); // Обновление данных на основе введенных параметров
  }
}
