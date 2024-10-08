import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@shared';
import { AuthenticationService } from './authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

const log = new Logger('Login');

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;
  passwordFieldType: string = 'password';
  passwordIcon: string = '../../assets/img/auth-img/eyes.png';
  iconWidth: string = '18px';
  iconHeight: string = '18px';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog
  ) {
    this.createForm();
  }

  ngOnInit() {}

  login() {
    if (this.loginForm.invalid) {
      this.error = 'Пожалуйста, заполните все обязательные поля.';
      return;
    }

    this.isLoading = true;
    const { username, password } = this.loginForm.value;

    this.authenticationService
      .login(username, password)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.loginForm.markAsPristine();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials) => {
          console.log(credentials);
          if (credentials && credentials.token) {
            this.router.navigate(['/map']);
            log.debug('${username} успешно вошёл в систему');
            console.log('Пользователь ${username} успешно вошёл в систему');
          } else {
            this.error = 'Ошибка: некорректный ответ от сервера.';
            this.router.navigate(['/map'], { replaceUrl: true });
          }
        },
        (error) => {
          log.debug('Ошибка входа: ${error}');
          this.error = 'Имя пользователя или пароль неправельный';
          this.router.navigate(['/map']);
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false],
    });
  }

  clearEmail() {
    this.loginForm.get('email')?.setValue('');
  }

  clearUsername() {
    this.loginForm.get('username')?.setValue('');
  }

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    this.passwordIcon =
      this.passwordFieldType === 'password'
        ? '../../assets/img/auth-img/eyes.png'
        : '../../assets/img/auth-img/close-eyes.png';

    if (this.passwordIcon.includes('close-eyes.png')) {
      this.iconWidth = '20px';
      this.iconHeight = '20px';
    } else {
      this.iconWidth = '18px';
      this.iconHeight = '18px';
    }
  }
  navigate() {
    this.router.navigate(['/home']);
  }

  openResetPasswordDialog(): void {
    this.dialog.open(ResetPasswordComponent, {
      width: '400px',
    });
  }
}
