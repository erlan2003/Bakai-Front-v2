import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core'; // Импортируйте LOCALE_ID здесь
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common'; // Импортируйте registerLocaleData
import localeRu from '@angular/common/locales/ru'; // Импортируйте русскую локализацию
import { MaterialModule } from './material.module';
import { BookingMapModule } from './booking-map/booking-map.module';
import { NotificationsModule } from './notifications/notifications.module';

import { environment } from '@env/environment';
import { RouteReusableStrategy, ApiPrefixInterceptor, ErrorHandlerInterceptor, SharedModule } from '@shared';
import { AuthModule } from '@app/auth';
import { ShellModule } from './shell/shell.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReportsModule } from './reports/reports.module';
import { ConferenceModule } from './conference/conference.module';

registerLocaleData(localeRu);

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    RouterModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    SharedModule,
    ShellModule,
    AuthModule,
    BookingMapModule,
    ReportsModule,
    ConferenceModule,
    AppRoutingModule,
    NotificationsModule,
  ],

  declarations: [AppComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'ru' }, // Установите локаль на русский
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
