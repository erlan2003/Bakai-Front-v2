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

  constructor(
    private dialogRef: MatDialogRef<TeamsComponent>,
    private reportsService: ReportsService // Inject the ReportsService
  ) {}

  ngOnInit(): void {}

  createTeam(): void {
    if (!this.teamName) {
      console.error('Team name is required');
      return;
    }

    const teamData = { name: this.teamName }; // Prepare the team data object
    this.reportsService.createEmployees(teamData).subscribe(
      (response) => {
        console.log('Team created successfully:', response);
        this.closeDialog(); // Optionally close the dialog after successful creation
      },
      (error) => {
        console.error('Error creating team:', error);
      }
    );
  }

  toggleTeamsDropdown(): void {
    if (this.isDropdownVisible) {
      this.isDropdownVisible = false; // Hide dropdown if it's already visible
    } else {
      this.reportsService.getTeams().subscribe(
        (response) => {
          this.teams = response;
          this.isDropdownVisible = true; // Show dropdown when teams are loaded
        },
        (error) => {
          console.error('Error fetching teams:', error);
        }
      );
    }
  }

  selectTeam(team: Team): void {
    this.teamName = team.name; // Update the input field with the selected team's name
    this.isDropdownVisible = false; // Hide dropdown after selection
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
