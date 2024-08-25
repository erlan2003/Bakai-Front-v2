import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkDaysComponent } from './work-days.component';

const routes: Routes = [{ path: '', component: WorkDaysComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkDaysRoutingModule {}
