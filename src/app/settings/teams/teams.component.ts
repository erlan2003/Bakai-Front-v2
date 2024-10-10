import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReportsService, Team } from 'src/app/settings/teams/teams.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { EditTeamDialogComponent } from './edit-team-dialog/edit-team-dialog.component';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  teamName: string = '';
  teams: Team[] = [];
  isDropdownVisible: boolean = false;
  editingTeamId: number | null = null;
  editedTeamName: string = '';

  constructor(
    private dialogRef: MatDialogRef<TeamsComponent>,
    private reportsService: ReportsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchTeams();
  }

  fetchTeams(): void {
    this.reportsService.getTeams().subscribe(
      (response) => {
        this.teams = response;
      },
      (error) => {
        console.error('Ошибка при получении команд:', error);
      }
    );
  }

  createTeam(): void {
    if (!this.teamName) {
      this.snackBar.open('Укажите название команды!', 'Закрыть', {
        duration: 3000,
        verticalPosition: 'bottom',
      });
      return;
    }

    const teamData = { name: this.teamName };
    this.reportsService.createEmployees(teamData).subscribe(
      (response) => {
        this.snackBar.open('Команда успешно создана!', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
        this.fetchTeams();
        this.closeDialog();
      },
      (error) => {
        this.snackBar.open('Ошибка создания команды!', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
      }
    );
  }

  toggleTeamsDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  selectTeam(team: Team): void {
    this.teamName = team.name;
    this.isDropdownVisible = false;
  }

  deleteTeam(id: number): void {
    this.reportsService.deleteTeam(id).subscribe(
      (response) => {
        this.snackBar.open('Команда успешно удалена', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
        this.fetchTeams();
      },
      (error: HttpErrorResponse) => {
        const errorMessage = error.error?.errorMessage || 'Ошибка при удалении команды';
        this.snackBar.open(errorMessage, 'Закрыть', {
          duration: 5000,
          verticalPosition: 'bottom',
        });
        console.error('Ошибка при удалении команды:', error);
      }
    );
  }

  editTeam(team: Team): void {
    const dialogRef = this.dialog.open(EditTeamDialogComponent, {
      width: '400px',
      data: { ...team },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && team.id !== undefined) {
        this.saveEditedTeam(team.id, result);
      }
    });
  }

  saveEditedTeam(id: number, name: string): void {
    const updatedTeam: Team = { id, name };

    this.reportsService.updateTeam(updatedTeam).subscribe(
      (response) => {
        this.snackBar.open('Команда успешно обновлена', 'Закрыть', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
        this.fetchTeams();
      },
      (error: HttpErrorResponse) => {
        const errorMessage = error.error?.errorMessage || 'Ошибка при обновлении команды';
        this.snackBar.open(errorMessage, 'Закрыть', {
          duration: 5000,
          verticalPosition: 'bottom',
        });
        console.error('Ошибка при обновлении команды:', error);
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
