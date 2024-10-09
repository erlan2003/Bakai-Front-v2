import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReportsService, Team } from 'src/app/settings/teams/teams.service';

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

  constructor(private dialogRef: MatDialogRef<TeamsComponent>, private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.fetchTeams();
  }

  fetchTeams(): void {
    this.reportsService.getTeams().subscribe(
      (response) => {
        this.teams = response;
      },
      (error) => {
        console.error('Error fetching teams:', error);
      }
    );
  }

  createTeam(): void {
    if (!this.teamName) {
      console.error('Team name is required');
      return;
    }

    const teamData = { name: this.teamName };
    this.reportsService.createEmployees(teamData).subscribe(
      (response) => {
        console.log('Team created successfully:', response);
        this.fetchTeams();
        this.closeDialog();
      },
      (error) => {
        console.error('Error creating team:', error);
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
        console.log('Team deleted successfully:', response);
        this.fetchTeams();
      },
      (error) => {
        console.error('Error deleting team:', error);
      }
    );
  }

  editTeam(team: Team): void {
    this.editingTeamId = team.id !== undefined ? team.id : null;
    this.editedTeamName = team.name;
  }

  saveEditedTeam(): void {
    if (this.editingTeamId === null) return;

    const updatedTeam: Team = { id: this.editingTeamId, name: this.editedTeamName };

    this.reportsService.updateTeam(updatedTeam).subscribe(
      (response) => {
        console.log('Team updated successfully:', response);
        this.fetchTeams();
        this.cancelEditing();
      },
      (error) => {
        console.error('Error updating team:', error);
      }
    );
  }

  cancelEditing(): void {
    this.editingTeamId = null;
    this.editedTeamName = '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
