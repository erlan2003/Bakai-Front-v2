import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { AvatarComponent } from './avatar/avatar.component';

@NgModule({
  declarations: [ProfileComponent, AvatarComponent],
  imports: [CommonModule, ProfileRoutingModule],
})
export class ProfileModule {}
