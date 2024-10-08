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
  ]; // Интервалы времени

  private currentStartDate: Date = new Date(); // Текущая стартовая дата

  constructor(private conferenceService: ConferenceService) {}
  expandedMeetings: { [meetingId: string]: boolean } = {};

  ngOnInit() {
    this.loadMeetings();
  }

  // Загрузить встречи для текущего диапазона дней
  loadMeetings() {
    this.days = this.generateDays(this.currentStartDate, 7); // Генерируем 7 дней
    const startDate = this.days[0]; // Первая дата
    const endDate = this.days[this.days.length - 1]; // Последняя дата

    // Запрашиваем данные с сервера
    this.conferenceService.getBookings(1, startDate, endDate).subscribe((data: any) => {
      console.log('Полученные встречи:', data); // Лог данных
      this.meetings = this.mapMeetings(data); // Преобразуем встречи по дням
      console.log('Встречи по дням:', this.meetings);
    });
  }

  // Генерация массива дней, начиная с текущей даты
  generateDays(start: Date, count: number): string[] {
    const days = [];
    for (let i = 0; i < count; i++) {
      const nextDay = new Date(start);
      nextDay.setDate(start.getDate() + i);
      days.push(nextDay.toISOString().split('T')[0]); // Формат в виде YYYY-MM-DD
    }
    return days;
  }

  // Преобразование данных встреч для отображения по дням
  mapMeetings(data: any): any {
    const meetings = {};
    this.days.forEach((day) => {
      meetings[day] = data.filter((meeting: any) => meeting.date === day);
    });
    return meetings;
  }

  // Рассчет временного диапазона для встречи
  getMeetingTimeRange(meeting: any) {
    const startHour = +meeting.startTime.split(':')[0];
    const startMinutes = +meeting.startTime.split(':')[1];
    const endHour = +meeting.endTime.split(':')[0];
    const endMinutes = +meeting.endTime.split(':')[1];

    const totalStart = startHour * 60 + startMinutes; // Время начала в минутах с полуночи
    const totalEnd = endHour * 60 + endMinutes; // Время окончания в минутах с полуночи

    const rowStart = Math.floor(totalStart / 30) + 1; // Ряд для времени начала
    const rowEnd = Math.ceil(totalEnd / 30) + 1; // Ряд для времени окончания

    const rowSpan = rowEnd - rowStart; // Высота встречи

    return {
      gridRow: `${rowStart} / ${rowEnd}`, // Встреча занимает ряды от начала до конца
      rowSpan: rowSpan,
    };
  }

  // Проверка, попадает ли встреча в текущий временной интервал
  isMeetingInTimeSlot(meeting: any, time: string): boolean {
    const [meetingStartHour, meetingStartMinutes] = meeting.startTime.split(':').map(Number);
    const [timeHour, timeMinutes] = time.split(':').map(Number);

    return meetingStartHour === timeHour && meetingStartMinutes === timeMinutes;
  }

  toggleMeetingExpansion(meetingId: string): void {
    this.expandedMeetings[meetingId] = !this.expandedMeetings[meetingId];
  }

  // Показ предыдущих 7 дней
  showPreviousWeek(): void {
    this.currentStartDate.setDate(this.currentStartDate.getDate() - 7);
    this.loadMeetings();
  }

  // Показ следующих 7 дней
  showNextWeek(): void {
    this.currentStartDate.setDate(this.currentStartDate.getDate() + 7);
    this.loadMeetings();
  }
}
