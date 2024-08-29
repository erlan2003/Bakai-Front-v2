import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReportsService, Team } from 'src/app/settings/teams/teams.service'; // Скорректируйте путь импорта при необходимости

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  teamName: string = ''; // Свойство для хранения имени команды
  teams: Team[] = []; // Свойство для хранения списка команд
  isDropdownVisible: boolean = false; // Свойство для управления видимостью выпадающего списка

  constructor(
    private dialogRef: MatDialogRef<TeamsComponent>,
    private reportsService: ReportsService // Инъекция сервиса ReportsService
  ) {}

  ngOnInit(): void {
    // Загружать команды можно и при инициализации компонента, если нужно сразу отображать данные
    this.getTeams();
  }

  getTeams(): void {
    this.reportsService.getTeams().subscribe(
      (response) => {
        this.teams = response;
        console.log('Команды успешно загружены:', this.teams);
      },
      (error) => {
        console.error('Ошибка при загрузке команд:', error);
      }
    );
  }

  createTeam(): void {
    if (!this.teamName) {
      console.error('Имя команды обязательно');
      return;
    }

    const teamData = { name: this.teamName }; // Подготовка объекта данных команды
    this.reportsService.createEmployees(teamData).subscribe(
      (response) => {
        console.log('Команда успешно создана:', response);
        this.getTeams(); // Обновление списка команд после успешного создания
        this.closeDialog(); // Опционально закрыть диалог после успешного создания
      },
      (error) => {
        console.error('Ошибка при создании команды:', error);
      }
    );
  }

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible; // Переключение видимости списка
    if (this.isDropdownVisible) {
      this.getTeams(); // Загружаем список команд при первом показе выпадающего списка
    }
  }

  selectTeam(team: string): void {
    this.teamName = team; // Установка выбранного имени команды в поле ввода
    this.isDropdownVisible = false; // Скрытие списка после выбора
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
