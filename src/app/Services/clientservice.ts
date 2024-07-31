import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientOffer } from '../Models/clientoffers';
import { Observable } from 'rxjs/internal/Observable';
import { ClientBalanceDetails } from '../Models/clientbalancedetails';
import { map } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class clientService {
  apiUrl: any = '';
  token: any = '';
  refreshToken: any = '';
  clientID: any = '';
  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.clientID = localStorage.getItem('userID');
  }

  getClientOffers(): Observable<ClientOffer[]> {
    const clientID = this.clientID; //83d2f7d9-6a59-4c7f-acf1-814842509647";
    const token: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoieXNoYWlraEBleGFtcGxlLmNvbSIsImV4cCI6MTcxOTIyNjU1OSwiaXNzIjoiQ29kZU1hemVBUEkiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo1MDY3OS8ifQ.PPKpVal_3wSyJqfZMI7v5RA9M5PEDQ9u_gtmfHoj_JQ';
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<ClientOffer[]>(
      `${this.apiUrl}/api/Offer/getCLientOffers/${clientID}`,
      { headers }
    );
  }

  getClientBalance(): Observable<ClientBalanceDetails[]> {
     //"83d2f7d9-6a59-4c7f-acf1-814842509647";
    const token: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoieXNoYWlraEBleGFtcGxlLmNvbSIsImV4cCI6MTcxOTIyNjU1OSwiaXNzIjoiQ29kZU1hemVBUEkiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo1MDY3OS8ifQ.PPKpVal_3wSyJqfZMI7v5RA9M5PEDQ9u_gtmfHoj_JQ';
    const headers = { Authorization: `Bearer ${token}` };

    return this.http
      .get<ClientBalanceDetails[]>(`${this.apiUrl}/api/Balance/${this.clientID}`, {
        headers,
      })
      .pipe(map((response) => response));
  }
}
