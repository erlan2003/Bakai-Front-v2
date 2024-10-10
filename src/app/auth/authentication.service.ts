import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CredentialsService, Credentials } from './credentials.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated = false;

  constructor(private router: Router, private http: HttpClient, private credentialsService: CredentialsService) {}

  login(username: string, password: string): Observable<any> {
    const loginPayload = { username, password };

    return this.http.post<{ token: string }>(`auth/token`, loginPayload).pipe(
      tap((response) => {
        const credentials: Credentials = {
          token: response.token,
        };
        this.credentialsService.setCredentials(credentials, true);
        this.isAuthenticated = true;
      }),
      catchError(this.handleError)
    );
  }

  logout(): Observable<void> {
    return new Observable<void>((observer) => {
      this.credentialsService.setCredentials(undefined, false);
      this.router.navigate(['/login'], { replaceUrl: true });
      observer.next();
      observer.complete();
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Неизвестная ошибка!';
    if (error.status === 401) {
      errorMessage = 'Неавторизованный запрос. Пожалуйста, проверьте свои учетные данные.';
    } else if (error.status === 0) {
      errorMessage = 'Ошибка сети. Пожалуйста, проверьте ваше подключение.';
    } else {
      errorMessage = `Ошибка: ${error.statusText}`;
    }
    console.error('HTTP ошибка:', error);
    return throwError(errorMessage);
  }
}
