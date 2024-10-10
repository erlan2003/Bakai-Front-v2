import { Component, OnInit } from '@angular/core';
import { NotificationService } from './notifications.service';
import { MatDialogRef } from '@angular/material/dialog';

interface AppNotification {
  id: number;
  date: string;
  time: string;
  message: string;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  notifications: AppNotification[] = [];

  constructor(
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<NotificationsComponent>
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    const date = '2024-09-04';
    this.notificationService.getNotifications(date).subscribe(
      (data) => {
        this.notifications = data.map((notification) => ({
          ...notification,
          time: this.formatTime(notification.time),
        }));
      },
      (error) => {
        console.error('Ошибка при получении данных', error);
      }
    );
  }

  formatTime(time: string): string {
    return time.slice(0, 5);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
