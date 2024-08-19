import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientOffer } from '../Models/clientoffers';
import { Observable } from 'rxjs/internal/Observable';
import { ClientBalanceDetails } from '../Models/clientbalancedetails';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import { environment } from '../../environments/environments';
import { LogService } from './log.service';
@Injectable({ providedIn: 'root' })
export class clientService {
  apiUrl: any = '';
  token: any = '';
  refreshToken: any = '';
  clientID: any = '';
  constructor(private http: HttpClient,private logService: LogService) {
    this.apiUrl = environment.apiUrl;
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.clientID = localStorage.getItem('userID');
  }

  getClientOffers(): Promise<any> {
    const clientID = this.clientID; //83d2f7d9-6a59-4c7f-acf1-814842509647";
     //const headers = { Authorization: `Bearer ${this.token}` };

    // return this.http.get<ClientOffer[]>(
    //   `${this.apiUrl}/api/Offer/getCLientOffers/${clientID}`,
    //   { headers }
    // );

    const headers = { Authorization: `Bearer ${this.token}` };
    var val = firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/api/Offer/getCLientOffers/${clientID}`, { headers }).pipe(
        catchError(async (err) => {
          this.logService.saveLog(err.message);
          var config = await this.logService.getConfiguration();
          return throwError(err);
        })
      )
    );
    return val;

  }

  getClientBalance(): Promise<any> {
     //"83d2f7d9-6a59-4c7f-acf1-814842509647";
   //const headers = { Authorization: `Bearer ${this.token}` };

    // return this.http
    //   .get<ClientBalanceDetails[]>(`${this.apiUrl}/api/Balance/${this.clientID}`, {
    //     headers,
    //   })
    //   .pipe(map((response) => response));

      const headers = { Authorization: `Bearer ${this.token}` };
    var val = firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/api/Balance/${this.clientID}`, { headers }).pipe(
        catchError(async (err) => {
          this.logService.saveLog(err.message);
          var config = await this.logService.getConfiguration();
          return throwError(err);
        })
      )
    );
    return val;

  }
}
