import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { I18nModule } from '@app/i18n';
import { MaterialModule } from '@app/material.module';
import { ShellComponent } from './shell.component';
import { AppIconComponent } from '@app/@shared/app-icon/app-icon.component';
import { SharedModule } from '@app/@shared';

@NgModule({
  imports: [CommonModule, TranslateModule, FlexLayoutModule, MaterialModule, I18nModule, RouterModule, SharedModule],
  declarations: [ShellComponent],
})
export class ShellModule {}
