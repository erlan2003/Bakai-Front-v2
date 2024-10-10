import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Team } from 'src/app/settings/teams/teams.service';

@Component({
  selector: 'app-edit-team-dialog',
  templateUrl: './edit-team-dialog.component.html',
  styleUrls: ['./edit-team-dialog.component.scss'],
})
export class EditTeamDialogComponent {
  editedTeamName: string;

  constructor(public dialogRef: MatDialogRef<EditTeamDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Team) {
    this.editedTeamName = data.name; // Инициализируем поле названием команды
  }

  save(): void {
    this.dialogRef.close(this.editedTeamName); // Закрываем диалоговое окно и возвращаем изменённое имя команды
  }

  cancel(): void {
    this.dialogRef.close(); // Закрываем диалоговое окно без сохранения
  }
}
