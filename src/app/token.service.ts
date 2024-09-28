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
    var token =
      localStorage.getItem('token') === null
        ? localStorage.getItem('refreshToken')
        : localStorage.getItem('token');

    return token;
  }

  // Method to set access and refresh tokens
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Method to refresh the token
  refreshToken(): Promise<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return Promise.reject('No refresh token available');
    }

    if (this.refreshTokenInProgress) {
      // If a refresh is already in progress, wait for it to complete
      return this.refreshTokenSubject
        .pipe(switchMap(() => Promise.resolve(this.getAccessToken())))
        .toPromise();
    } else {
      this.refreshTokenInProgress = true;

      return this.http
        .post<any>(`${this.apiUrl}/account/refreshToken`, { refreshToken })
        .pipe(
          tap((response: any) => {
            this.setTokens(response.accessToken, response.refreshToken);
            this.refreshTokenSubject.next(response.accessToken);
            this.refreshTokenInProgress = false;
          })
        )
        .toPromise()
        .then((response) => response.accessToken);
    }
  }
}
