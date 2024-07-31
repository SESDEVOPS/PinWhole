import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderItem } from '../Models/item-model';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { Region } from '../Models/region';
import { Currency } from '../Models/denomination';
import { CodeDetails } from '../Models/codedetails';
import { BehaviorSubject, firstValueFrom, Subject, throwError } from 'rxjs';
import { Status } from '../Models/status';
import { environment } from '../../environments/environments';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private balanceSubject = new BehaviorSubject<number>(0);
  balance$ = this.balanceSubject.asObservable();
  
  apiUrl: any = ''; 
  token: any = '';
  refreshToken: any = '';
  clientID: any = '';
  constructor(private http: HttpClient, private logService: LogService) {
    this.apiUrl = environment.apiUrl;
    this.token = localStorage.getItem("token");
    this.refreshToken=localStorage.getItem("refreshToken");
    this.clientID = localStorage.getItem('userID');
  }

  getUpdatedBalance(newBalance: number): void {
    this.balanceSubject.next(newBalance);
  }

  GetClientBalance(): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };
    return firstValueFrom(
      this.http
        .get<any>(
          `${this.apiUrl}/api/balance/getBalance/${this.clientID}/USD`,
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
