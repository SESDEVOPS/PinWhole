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
import { Token } from '@angular/compiler';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root',
})
export class EzipinService {
  apiUrl: any = ''; 
   token: any = '';
   refreshToken: any = '';
 

  constructor(private http: HttpClient, private logService: LogService, private tokenService: TokenService) {
    this.apiUrl = environment.apiUrl;
    //this.token = localStorage.getItem("token");
    this.token  = this.tokenService.getAccessToken();
    this.refreshToken=localStorage.getItem("refreshToken")
  }

  createOrder(orderToProceed: FormData): Promise<any> {  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return firstValueFrom(
      this.http
        .post<any>(`${this.apiUrl}/api/ezpin/createOrder`, orderToProceed, {
          headers,
        })
        .pipe(
          catchError(async (err) => {
            this.logService.saveLog(err.message);
            var config = await this.logService.getConfiguration();
            return throwError(err);
          })
        )
    );
  }

  getOrderCardInfo(orderRefCode: string): Promise<any> {    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return firstValueFrom(
      this.http
        .get<any>(`${this.apiUrl}/api/ezpin/cardInfo/${orderRefCode}`, {
          headers,
        })
        .pipe(
          catchError(async (err) => {
            this.logService.saveLog(err.message);
            var config = await this.logService.getConfiguration();
            return throwError(err);
          })
        )
    );
  }

  getIfCatalogAvaliable(sku: any, qty: any, price: any): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };
     return firstValueFrom(
      this.http
        .get<any>(
          `${this.apiUrl}/api/ezpin/checkCatAvailablitiy/${sku}/${qty}/${price}`,
          { headers }
        )
        .pipe(
          catchError(async (err) => {
            this.logService.saveLog(err.message);
            var config = await this.logService.getConfiguration();
            return throwError(err);
          })
        )
    );
  }
}
