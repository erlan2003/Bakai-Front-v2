import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { AvatarComponent } from './avatar/avatar.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/@shared';

@NgModule({
  declarations: [ProfileComponent, AvatarComponent],
  imports: [CommonModule, ProfileRoutingModule, ImageCropperModule, MaterialModule, SharedModule],
})
export class ProfileModule {}
