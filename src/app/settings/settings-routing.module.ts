import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { SettingsComponent } from './settings.component';

const routes: Routes = [
  // Module is lazy loaded, see app-routing.module.ts
  { path: '', component: SettingsComponent, data: { title: marker('Settings') } },
  {
    path: 'booking-workplace',
    loadChildren: () => import('./booking-workplace/booking-workplace.module').then((m) => m.BookingWorkplaceModule),
  },
  {
    path: 'booking-meetingroom',
    loadChildren: () =>
      import('./booking-meetingroom/booking-meetingroom.module').then((m) => m.BookingMeetingroomModule),
  },
  { path: 'work-days', loadChildren: () => import('./work-days/work-days.module').then((m) => m.WorkDaysModule) },
  { path: 'teams', loadChildren: () => import('./teams/teams.module').then((m) => m.TeamsModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SettingsRoutingModule {}
