import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderItem } from '../Models/item-model';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { Region } from '../Models/region';
import { Currency } from '../Models/denomination';
import { CodeDetails } from '../Models/codedetails';
import { firstValueFrom, Subject } from 'rxjs';
import { Status } from '../Models/status';
import { environment } from '../../environments/environments';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public isAuthenticated = false;
  apiUrl: any = ''; 
  token: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoieXNoYWlraEBleGFtcGxlLmNvbSIsImV4cCI6MTcxOTIyNjU1OSwiaXNzIjoiQ29kZU1hemVBUEkiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo1MDY3OS8ifQ.PPKpVal_3wSyJqfZMI7v5RA9M5PEDQ9u_gtmfHoj_JQ';

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  Login(body: any): Promise<any> {
    //console.log('body', body)
    const token: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoieXNoYWlraEBleGFtcGxlLmNvbSIsImV4cCI6MTcxOTIyNjU1OSwiaXNzIjoiQ29kZU1hemVBUEkiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo1MDY3OS8ifQ.PPKpVal_3wSyJqfZMI7v5RA9M5PEDQ9u_gtmfHoj_JQ';
    // const headers = { Authorization: `Bearer ${token}` };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
     
    });

     var response = firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/account/login`, body)
      
    );
    this.isAuthenticated = true;
    return response;
  }

  ToTP(body: any): Promise<any> {
    const token: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoieXNoYWlraEBleGFtcGxlLmNvbSIsImV4cCI6MTcxOTIyNjU1OSwiaXNzIjoiQ29kZU1hemVBUEkiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo1MDY3OS8ifQ.PPKpVal_3wSyJqfZMI7v5RA9M5PEDQ9u_gtmfHoj_JQ';
    // const headers = { Authorization: `Bearer ${token}` };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
     
    });

    return firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/account/totp`, body, {
        headers,
      })
    );
  }

  ValidateToTP(code:any,body:any): Promise<any> {
    const token: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoieXNoYWlraEBleGFtcGxlLmNvbSIsImV4cCI6MTcxOTIyNjU1OSwiaXNzIjoiQ29kZU1hemVBUEkiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo1MDY3OS8ifQ.PPKpVal_3wSyJqfZMI7v5RA9M5PEDQ9u_gtmfHoj_JQ';
    // const headers = { Authorization: `Bearer ${token}` };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
     
    });

    return firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/account/validateTotp/${code}`, body, {
        headers,
      })
    );
  }

  refreshToken(body:any): Promise<any> {
    const token: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoieXNoYWlraEBleGFtcGxlLmNvbSIsImV4cCI6MTcxOTIyNjU1OSwiaXNzIjoiQ29kZU1hemVBUEkiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo1MDY3OS8ifQ.PPKpVal_3wSyJqfZMI7v5RA9M5PEDQ9u_gtmfHoj_JQ';
    // const headers = { Authorization: `Bearer ${token}` };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
     
    });

    return firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/account/refresh-token`, body, {
        headers,
      })
    );
  }

  
}
