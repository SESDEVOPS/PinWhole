import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { environment } from '../environments/environments';
import { LogService } from './Services/log.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  apiUrl: any = '';
  token: any = '';
  clientID: any = '';

  constructor(private http: HttpClient, private logService: LogService) {
    this.apiUrl = environment.apiUrl;
    this.token = localStorage.getItem('token');
    this.clientID = localStorage.getItem('userID');
  }
  // Method to get access token from local storage
  getAccessToken(): string | null {
    this.token =
      localStorage.getItem('token') === null
        ? localStorage.getItem('refreshToken')
        : localStorage.getItem('token');

    if (this.isTokenExpired(this.token)) {
      this.refreshToken();

      this.token =
      localStorage.getItem('token') === null
        ? localStorage.getItem('refreshToken')
        : localStorage.getItem('token');
    }

    return this.token;
  }

  isTokenExpired(token: string): any {
    if (token != null) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expTime = tokenPayload.exp;
      return Math.floor(new Date().getTime() / 1000) >= expTime;
    }
    return null;
  }

  // Method to set access and refresh tokens
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  refreshToken() {
    var body = {
      AccessToken: localStorage.getItem('token'),
      RefreshToken: localStorage.getItem('refreshToken'),
    };

    this.http
      .post<any>(`${this.apiUrl}/account/refreshToken`, body)
      .subscribe((token: any) => {
        localStorage.setItem('token', token.accessToken);
        localStorage.setItem('refreshToken', token.refreshToken);
      });
  }
}
