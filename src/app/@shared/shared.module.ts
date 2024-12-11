import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';
import { AppIconComponent } from './app-icon/app-icon.component';

import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [FlexLayoutModule, MaterialModule, TranslateModule, CommonModule, MatIconModule],
  declarations: [LoaderComponent, AppIconComponent],
  exports: [LoaderComponent, AppIconComponent],
})
export class SharedModule {}
