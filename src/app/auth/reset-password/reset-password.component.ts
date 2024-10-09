import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../employees/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../employees/message-dialog/message-dialog.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  resetForm: FormGroup;

  constructor(private fb: FormBuilder, private employeeService: EmployeeService, private dialog: MatDialog) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.resetForm.valid) {
      this.employeeService.resetPassword(this.resetForm.value.email).subscribe(
        () => {
          this.dialog.open(MessageDialogComponent, {
            data: { message: 'Код для сброса пароля отправлен на почту.', title: 'Успех' },
          });
        },
        (error) => {
          this.dialog.open(MessageDialogComponent, {
            data: { message: 'Ошибка при отправке кода. Пожалуйста, проверьте почту.', title: 'Ошибка' },
          });
        }
      );
    }
  }
}
