import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReportsService, Team } from 'src/app/settings/teams/teams.service'; // Adjust the import path as needed

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  teamName: string = ''; // Property to store the team name
  teams: Team[] = []; // Property to store the list of teams
  isDropdownVisible: boolean = false; // Toggle for dropdown visibility
  editingTeamId: number | null = null; // State for the currently editing team ID
  editedTeamName: string = ''; // State for the edited team name

  constructor(
    private dialogRef: MatDialogRef<TeamsComponent>,
    private reportsService: ReportsService // Inject the ReportsService
  ) {}

  ngOnInit(): void {
    // Fetch teams when the component initializes
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

    const teamData = { name: this.teamName }; // Prepare the team data object
    this.reportsService.createEmployees(teamData).subscribe(
      (response) => {
        console.log('Team created successfully:', response);
        this.fetchTeams(); // Refresh team list
        this.closeDialog(); // Optionally close the dialog after successful creation
      },
      (error) => {
        console.error('Error creating team:', error);
      }
    );
  }

  toggleTeamsDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible; // Toggle dropdown visibility
  }

  selectTeam(team: Team): void {
    this.teamName = team.name; // Update the input field with the selected team's name
    this.isDropdownVisible = false; // Hide dropdown after selection
  }

  deleteTeam(id: number): void {
    this.reportsService.deleteTeam(id).subscribe(
      (response) => {
        console.log('Team deleted successfully:', response);
        this.fetchTeams(); // Refresh team list after deletion
      },
      (error) => {
        console.error('Error deleting team:', error);
      }
    );
  }

  editTeam(team: Team): void {
    this.editingTeamId = team.id !== undefined ? team.id : null; // Проверка на undefined
    this.editedTeamName = team.name; // Set the initial name for editing
  }

  saveEditedTeam(): void {
    if (this.editingTeamId === null) return;

    const updatedTeam: Team = { id: this.editingTeamId, name: this.editedTeamName };

    this.reportsService.updateTeam(updatedTeam).subscribe(
      (response) => {
        console.log('Team updated successfully:', response);
        this.fetchTeams(); // Refresh team list after updating
        this.cancelEditing(); // Exit editing mode
      },
      (error) => {
        console.error('Error updating team:', error);
      }
    );
  }

  cancelEditing(): void {
    this.editingTeamId = null; // Reset the editing team ID
    this.editedTeamName = ''; // Reset the edited team name
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
