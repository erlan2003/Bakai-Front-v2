import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from '../../employees/employee.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  currentEmployee: Employee | null = null;

  constructor(private employeeService: EmployeeService, private dialogRef: MatDialogRef<AvatarComponent>) {}

  ngOnInit(): void {
    this.loadCurrentEmployee();
  }

  loadCurrentEmployee() {
    this.employeeService.getCurrentEmployee().subscribe(
      (data) => {
        this.currentEmployee = data;
        console.log(this.currentEmployee);
      },
      (error) => {
        console.error('Error fetching current employee', error);
      }
    );
  }
}
