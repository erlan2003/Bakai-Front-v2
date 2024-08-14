import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { ReportsModule } from './reports/reports.module';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'reports', loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule) },
  ]),
  Shell.childRoutes([
    { path: 'profile', loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule) },
  ]),
  Shell.childRoutes([
    { path: 'employees', loadChildren: () => import('./employees/employees.module').then((m) => m.EmployeesModule) },
  ]),
  Shell.childRoutes([
    {
      path: 'conference',
      loadChildren: () => import('./conference/conference.module').then((m) => m.ConferenceModule),
    },
  ]),
  Shell.childRoutes([
    { path: 'settings', loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule) },
  ]),
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
