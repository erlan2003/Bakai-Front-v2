import { Component, OnInit } from '@angular/core';
import { ConferenceService } from './conference.service';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss'],
})
export class ConferenceComponent implements OnInit {
  meetings: { [key: string]: any[] } = {}; // Объект для хранения встреч по дням
  days: string[] = []; // Массив для хранения дат
  timeSlots: string[] = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
  ]; // Временные интервалы

  constructor(private conferenceService: ConferenceService) {}

  ngOnInit() {
    const today = new Date();
    this.days = this.generateDays(today, 7); // Генерация следующих 7 дней
    this.conferenceService.getBookings().subscribe((data: any) => {
      console.log('Полученные данные о встречах:', data); // Логируем полученные данные
      this.meetings = this.mapMeetings(data);
      console.log('Встречи по дням:', this.meetings); // Логируем распределенные встречи
    });
  }

  // Генерация массивов дней начиная с текущей даты
  generateDays(start: Date, count: number): string[] {
    const days = [];
    for (let i = 0; i < count; i++) {
      const nextDay = new Date(start);
      nextDay.setDate(start.getDate() + i);
      days.push(nextDay.toISOString().split('T')[0]); // Форматировать как YYYY-MM-DD
    }
    return days;
  }

  // Преобразование данных встреч для отображения по дням
  mapMeetings(data: any): any {
    // Пример простой логики для отображения по дням
    const meetings = {};
    this.days.forEach((day) => {
      meetings[day] = data.date === day ? [data] : [];
    });
    return meetings;
  }

  // Метод для вычисления диапазона времени для отображения встречи
  getMeetingTimeRange(meeting: any) {
    const startHour = +meeting.startTime.split(':')[0];
    const startMinutes = +meeting.startTime.split(':')[1];
    const endHour = +meeting.endTime.split(':')[0];
    const endMinutes = +meeting.endTime.split(':')[1];

    const totalStart = startHour * 60 + startMinutes; // Общее время начала в минутах
    const totalEnd = endHour * 60 + endMinutes; // Общее время конца в минутах

    let rowStart = Math.floor(totalStart / 30); // Позиция начала
    const rowEnd = Math.ceil(totalEnd / 30); // Позиция конца

    // Перемещаем встречу на одну ячейку выше
    if (rowStart > 0) {
      rowStart -= 1; // Смещаем встречу на одну ячейку выше
    }

    return {
      gridRow: `${rowStart} / span ${rowEnd - rowStart + 1}`, // Увеличиваем интервал для корректного отображения
    };
  }

  // Проверка, находится ли встреча в текущем временном интервале
  isMeetingInTimeSlot(meeting: any, time: string): boolean {
    const meetingStart = meeting.startTime;
    const meetingEnd = meeting.endTime;

    // Проверяем, если текущий временной интервал находится между временем начала и конца встречи
    return meetingStart <= time && time < meetingEnd;
  }
}
