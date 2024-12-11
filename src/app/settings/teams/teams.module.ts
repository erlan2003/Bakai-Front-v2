import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsComponent } from './teams.component';
import { EditTeamDialogComponent } from './edit-team-dialog/edit-team-dialog.component';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '@app/@shared';

@NgModule({
  declarations: [TeamsComponent, EditTeamDialogComponent],
  imports: [CommonModule, TeamsRoutingModule, FormsModule, MaterialModule, SharedModule],
})
export class TeamsModule {}
