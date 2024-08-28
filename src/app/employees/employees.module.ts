import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import { EmployeesRoutingModule } from './employees-routing.module';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [EmployeesComponent],
  imports: [CommonModule, EmployeesRoutingModule, FormsModule],
})
export class EmployeesModule {}
