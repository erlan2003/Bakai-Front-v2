import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',  // измените на 'app-reports'
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {  // измените на ReportsComponent
  // Добавляем массив employees с примерными данными
  employees = [
    { lastName: 'Иванов', firstName: 'Иван', middleName: 'Иванович', team: 'Команда 1', position: 'Должность 1', location: 'Место 1', date: '01.08.2024' },
    { lastName: 'Петров', firstName: 'Петр', middleName: 'Петрович', team: 'Команда 2', position: 'Должность 2', location: 'Место 2', date: '02.08.2024' },
    // Добавьте другие данные по необходимости
  ];
}
