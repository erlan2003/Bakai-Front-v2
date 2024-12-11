import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@shared';
import { AuthenticationService } from './authentication.service';
import { MatDialog } from '@angular/material/dialog';

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
  isPasswordVisible: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
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
          if (credentials && credentials.token) {
            this.router.navigate(['/map']);
          } else {
            this.error = 'Ошибка: некорректный ответ от сервера.';
            this.router.navigate(['/map'], { replaceUrl: true });
          }
        },
        (error) => {
          log.debug('Ошибка входа: ${error}');
          this.error = 'Имя пользователя или пароль неправильный';
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

  clearUsername() {
    this.loginForm.get('username')?.setValue('');
  }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordFieldType = this.isPasswordVisible ? 'text' : 'password';
  }
  navigate() {
    this.router.navigate(['/home']);
  }
}
