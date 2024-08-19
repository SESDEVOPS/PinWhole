import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';
import { Supplier } from '../Models/supplier';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  apiUrl: any = '';
  token: any = '';
  refreshToken: any = '';
  clientID: any = '';
  constructor(private http: HttpClient, private logService: LogService) {
    this.apiUrl = environment.apiUrl;
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.clientID = localStorage.getItem('userID');
  }

  getAllSuppliers(): Promise<any> {
     //'83d2f7d9-6a59-4c7f-acf1-814842509647';
    const headers = { Authorization: `Bearer ${this.token}` };
    // return this.http.get<Supplier[]>(`${this.apiUrl}/api/supplier`, {
    //   headers,
    // });
    return firstValueFrom(
      this.http.get<any>(
        `${this.apiUrl}/api/supplier`,
        { headers }
      )
    );
  }

  // getIfCatalogAvaliable(sku:any,qty:any,price:any) : Observable<any> {
  //     const clientID = '83d2f7d9-6a59-4c7f-acf1-814842509647';
  //     const token: string =
  //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoieXNoYWlraEBleGFtcGxlLmNvbSIsImV4cCI6MTcxOTIyNjU1OSwiaXNzIjoiQ29kZU1hemVBUEkiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo1MDY3OS8ifQ.PPKpVal_3wSyJqfZMI7v5RA9M5PEDQ9u_gtmfHoj_JQ';
  //     const headers = { Authorization: `Bearer ${token}` };

  //     return this.http.get<any>(
  //       `https://clienttest.pinwhole.com/api/checkCatAvailablitiy${sku}/${qty}/${price}`,
  //       { headers }
  //     );
  //   }

  getIfCatalogAvaliable(sku: any, qty: any, price: any): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };

    // Simulating an async operation (like an HTTP request)
    return firstValueFrom(
      this.http.get<any>(
        `${this.apiUrl}/api/ezpin/checkCatAvailablitiy/${sku}/${qty}/${price}`,
        { headers }
      )
    );
  }
  checkStockExists(ean: any): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };

    // Simulating an async operation (like an HTTP request)
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
}
