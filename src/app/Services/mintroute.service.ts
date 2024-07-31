import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderItem } from '../Models/item-model';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { Region } from '../Models/region';
import { Currency } from '../Models/denomination';
import { CodeDetails } from '../Models/codedetails';
import { firstValueFrom, Subject, throwError } from 'rxjs';
import { Status } from '../Models/status';
import { environment } from '../../environments/environments';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root',
})
export class MintrouteService {
  apiUrl: any = '';
  token: any = '';
  refreshToken: any = '';

  constructor(private http: HttpClient, private logService: LogService) {
    this.apiUrl = environment.apiUrl;
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  checkStockExists(ean: any): Promise<any> {
    //console.log("stringyFY",JSON.stringify(orderToProceed));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return firstValueFrom(
      this.http.get<any>(`${this.apiUrl}/api/Mintroute/checkStock/${ean}`, {
        headers,
      }).pipe(
        catchError(async (err) => {
          this.logService.saveLog(err.message);
          var config = await this.logService.getConfiguration();
          return throwError(err);
        })
      )
    );
  }

  addOrder(ean: any): Promise<any> {
    //console.log("stringyFY",JSON.stringify(orderToProceed));
    const token: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoieXNoYWlraEBleGFtcGxlLmNvbSIsImV4cCI6MTcxOTIyNjU1OSwiaXNzIjoiQ29kZU1hemVBUEkiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo1MDY3OS8ifQ.PPKpVal_3wSyJqfZMI7v5RA9M5PEDQ9u_gtmfHoj_JQ';
    // const headers = { Authorization: `Bearer ${token}` };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return firstValueFrom(
      this.http.get<any>(`${this.apiUrl}/Mintroute/createOrder/${ean}`, {
        headers,
      })
    );
  }

  addBulkOrder(ean: any, qty: any): Promise<any> {
   // const headers = { Authorization: `Bearer ${token}` };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return firstValueFrom(
      this.http.get<any>(
        `${this.apiUrl}/api/Mintroute/createBulkOrder/${ean}${qty}`,
        {
          headers,
        }
      ).pipe(
        catchError(async (err) => {
          this.logService.saveLog(err.message);
          var config = await this.logService.getConfiguration();
          return throwError(err);
        })
      )
    );
  }
}
