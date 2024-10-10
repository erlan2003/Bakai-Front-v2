import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Credentials {
  token: string;
}

const credentialsKey = 'credentials';

@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private _credentials: Credentials | null = null;

  constructor() {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  isAuthenticated(): boolean {
    return !!this._credentials;
  }

  get token(): string | undefined {
    return this._credentials?.token;
  }

  setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    const storage = remember ? localStorage : sessionStorage;
    if (credentials) {
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
}
