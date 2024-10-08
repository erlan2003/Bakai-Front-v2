// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { TranslateModule } from '@ngx-translate/core';
// import { FlexLayoutModule } from '@angular/flex-layout';

// import { SharedModule } from '@shared';
// import { MaterialModule } from '@app/material.module';
// import { I18nModule } from '@app/i18n';
// import { AuthRoutingModule } from './auth-routing.module';
// import { LoginComponent } from './login.component';
// import { FormsModule } from '@angular/forms';

// @NgModule({
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     TranslateModule,
//     SharedModule,
//     FlexLayoutModule,
//     MaterialModule,
//     I18nModule,
//     AuthRoutingModule,
//     FormsModule
//   ],
//   declarations: [LoginComponent],
// })
// export class AuthModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { I18nModule } from '@app/i18n';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    I18nModule,
    AuthRoutingModule,
  ],
  declarations: [LoginComponent, RecoverPasswordComponent, ResetPasswordComponent],
})
export class AuthModule {}
