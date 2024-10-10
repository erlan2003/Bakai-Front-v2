import { Component, OnInit } from '@angular/core';
import { ConferenceService } from './conference.service';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss'],
})
export class ConferenceComponent implements OnInit {
  meetings: { [key: string]: any[] } = {};
  days: string[] = [];
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
  ];

  private currentStartDate: Date = new Date();

  constructor(private conferenceService: ConferenceService) {}
  expandedMeetings: { [meetingId: string]: boolean } = {};

  ngOnInit() {
    this.loadMeetings();
  }

  loadMeetings() {
    this.days = this.generateDays(this.currentStartDate, 7);
    const startDate = this.days[0];
    const endDate = this.days[this.days.length - 1];

    this.conferenceService.getBookings(1, startDate, endDate).subscribe((data: any) => {
      this.meetings = this.mapMeetings(data);
    });
  }

  generateDays(start: Date, count: number): string[] {
    const days = [];
    for (let i = 0; i < count; i++) {
      const nextDay = new Date(start);
      nextDay.setDate(start.getDate() + i);
      days.push(nextDay.toISOString().split('T')[0]);
    }
    return days;
  }

  mapMeetings(data: any): any {
    const meetings = {};
    this.days.forEach((day) => {
      meetings[day] = data.filter((meeting: any) => meeting.date === day);
    });
    return meetings;
  }

  getMeetingTimeRange(meeting: any) {
    const startHour = +meeting.startTime.split(':')[0];
    const startMinutes = +meeting.startTime.split(':')[1];
    const endHour = +meeting.endTime.split(':')[0];
    const endMinutes = +meeting.endTime.split(':')[1];

    const totalStart = startHour * 60 + startMinutes;
    const totalEnd = endHour * 60 + endMinutes;

    const rowStart = Math.floor(totalStart / 30) + 1;
    const rowEnd = Math.ceil(totalEnd / 30) + 1;

    const rowSpan = rowEnd - rowStart;

    return {
      gridRow: `${rowStart} / ${rowEnd}`,
      rowSpan: rowSpan,
    };
  }

  isMeetingInTimeSlot(meeting: any, time: string): boolean {
    const [meetingStartHour, meetingStartMinutes] = meeting.startTime.split(':').map(Number);
    const [timeHour, timeMinutes] = time.split(':').map(Number);

    return meetingStartHour === timeHour && meetingStartMinutes === timeMinutes;
  }

  toggleMeetingExpansion(meetingId: string): void {
    this.expandedMeetings[meetingId] = !this.expandedMeetings[meetingId];
  }

  showPreviousWeek(): void {
    this.currentStartDate.setDate(this.currentStartDate.getDate() - 7);
    this.loadMeetings();
  }

  showNextWeek(): void {
    this.currentStartDate.setDate(this.currentStartDate.getDate() + 7);
    this.loadMeetings();
  }
}
