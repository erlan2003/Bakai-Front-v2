import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import { EmployeesRoutingModule } from './employees-routing.module';
import { FormsModule } from '@angular/forms';
import { EmployeeRegisterComponent } from './employee-register/employee-register.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EmployeesComponent, EmployeeRegisterComponent, MessageDialogComponent],
  imports: [CommonModule, EmployeesRoutingModule, FormsModule, ReactiveFormsModule],
})
export class EmployeesModule {}
