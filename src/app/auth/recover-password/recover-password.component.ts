import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../employees/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../employees/message-dialog/message-dialog.component';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
})
export class RecoverPasswordComponent implements OnInit {
  recoverForm: FormGroup;

  constructor(private fb: FormBuilder, private employeeService: EmployeeService, private dialog: MatDialog) {
    this.recoverForm = this.fb.group({
      code: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.recoverForm.valid && this.recoverForm.value.newPassword === this.recoverForm.value.confirmPassword) {
      this.employeeService
        .recoverPassword(
          this.recoverForm.value.code,
          this.recoverForm.value.newPassword,
          this.recoverForm.value.confirmPassword
        )
        .subscribe(
          () => {
            this.dialog.open(MessageDialogComponent, {
              data: { message: 'Пароль успешно изменён.', title: 'Успех' },
            });
          },
          (error) => {
            this.dialog.open(MessageDialogComponent, {
              data: { message: 'Ошибка при восстановлении пароля. Пожалуйста, проверьте код.', title: 'Ошибка' },
            });
          }
        );
    } else {
      this.dialog.open(MessageDialogComponent, {
        data: { message: 'Пароли не совпадают.', title: 'Ошибка' },
      });
    }
  }
}
