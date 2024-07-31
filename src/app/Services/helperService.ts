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

@Injectable({ providedIn: 'root' })
export class HelperService {
  apiUrl: any = '';
  token: any = '';
  refreshToken: any = '';
  proxyUrl = 'https://cors-anywhere.herokuapp.com/';

  constructor(private http: HttpClient, private logService: LogService) {
    this.apiUrl = environment.apiUrl;
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  
  private _subject = new Subject<any>();
  getRegions(): Observable<Region[]> {
    const headers = { Authorization: `Bearer ${this.token}` };

    return this.http
      .get<Region[]>(`${this.apiUrl}/api/region`, { headers })
      .pipe(map((response) => response));
  }
  getCurrencies(): Observable<Currency[]> {
    const headers = { Authorization: `Bearer ${this.token}` };
    return this.http
      .get<Currency[]>(`${this.apiUrl}/api/codeType`, {
        headers,
      })
      .pipe(map((response) => response));
  }

  getStatuses(): Observable<Status[]> {
    const headers = { Authorization: `Bearer ${this.token}` };
    return this.http
      .get<Status[]>(`${this.apiUrl}/api/Status`, {
        headers,
      })
      .pipe(map((response) => response));
  }

  getCodeDetails(code: string): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };
    return firstValueFrom(
      this.http.get<any>(`${this.apiUrl}/api/Code/${code}`, {
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

  getAllNewCodeValueByCodeId(codeID: any): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };
    var val = firstValueFrom(
      this.http.get<any>(
        `${this.apiUrl}/api/codeValue/getAllNewByCode/${codeID}`,
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

    return val;
  }

  getCodeTypeById(codeTypeId: any): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };
    // Simulating an async operation (like an HTTP request)
    return firstValueFrom(
      this.http.get<any>(`${this.apiUrl}/api/codeType/${codeTypeId}`, {
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

  getStatusByName(statusName: string): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };
    // Simulating an async operation (like an HTTP request)
    return firstValueFrom(
      this.http.get<any>(`${this.apiUrl}/api/Status/${statusName}`, { headers }).pipe(
        catchError(async (err) => {
          this.logService.saveLog(err.message);
          var config = await this.logService.getConfiguration();
          return throwError(err);
        })
      )
    );
  }

  getBalanceByclientIdandCurrencyAsync(
    clientID: any,
    currencyName: any
  ): Promise<any[]> {
    const headers = { Authorization: `Bearer ${this.token}` };
    // Simulating an async operation (like an HTTP request)
    return firstValueFrom(
      this.http.get<any>(
        `${this.apiUrl}/api/balance/getBalance/${clientID}/${currencyName}`,
        { headers }
      ).pipe(
        catchError(async (err) => {
          this.logService.saveLog(err.message);
          var config = await this.logService.getConfiguration();
          return [];
        })
      )
    );
  }

  getExchangeRate(status: any): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };
    // Simulating an async operation (like an HTTP request)
    return firstValueFrom(
      this.http.get<any>(`${this.apiUrl}/api/exchangeRate/${status}`, {
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

  editBlance(balance: any): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };

    return firstValueFrom(
      this.http.put<any>(`${this.apiUrl}/api/balance/edit`, balance, {
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

  async getAvailableCodeValueQuantity(codeID: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // get availabe qty
      await this.getAllNewCodeValueByCodeId(codeID).then((data) => {
        if (data) {
          resolve(data.length);
        } else resolve(0);
      });
    });
  }

  // GetBalanceByclientIdandCurrencyAsync(clientID:any,currencyName:any): Promise<any[]> {
  //   const token: string =
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoieXNoYWlraEBleGFtcGxlLmNvbSIsImV4cCI6MTcxOTIyNjU1OSwiaXNzIjoiQ29kZU1hemVBUEkiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo1MDY3OS8ifQ.PPKpVal_3wSyJqfZMI7v5RA9M5PEDQ9u_gtmfHoj_JQ';
  //   const headers = { Authorization: `Bearer ${token}` };

  //   // Simulating an async operation (like an HTTP request)
  //   return firstValueFrom(
  //     this.http.get<any>(
  //       `https://clienttest.pinwhole.com/api/balance/getBalance/${clientID}/${currencyName}`,
  //       { headers }
  //     )
  //   );
  // }

  checkRate(from: any, price: any): Promise<any> {
    var currenyConversion: any = {
      ToCurrency: from,
      FromCurrency: from,
      Price: price,
    };

  const headers = { Authorization: `Bearer ${this.token}` };
    // Simulating an async operation (like an HTTP request)
    return firstValueFrom(
      this.http.post<any>(
        `${this.apiUrl}/api/orders/currecyRate`,
        currenyConversion,
        { headers }
      ).pipe(
        catchError(async (err) => {
          this.logService.saveLog(err.message);
          var config = await this.logService.getConfiguration();
          return throwError(err);
        })
      )
    );
  }

  paymentFormater(price: any) {
    var formattedPrice = price.toFixed(2);
    return formattedPrice;
  }

  async saveTransaction(
    clientID: any,
    price: any,
    currency: any,
    payMethod: any,
    TransactionType: any,
    Beneficiary: any,
    BillNumber: any,
    clientName: any,
    orderDateTime: any
  ): Promise<any> {
    //save in transaction table
    var all: any;
    await this.getBalanceByclientIdandCurrencyAsync(clientID, currency).then(
      (a: any) => {
        all = a;
      }
    );

    console.log(' all ', all);
    var transaction = {
      ApplicationUserId: clientID,
      TransactionMethod: payMethod,
      TotalPrice: Number(price),
      TransactionType: TransactionType,
      Beneficiary: Beneficiary,
      BillNumber: BillNumber,
      BillDate: orderDateTime,
      ClientName: clientName,
      Currency: currency,
      Balance: all.balance,
    };
    return new Promise((resolve, reject) => {
      this.addTransaction(transaction)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  addTransaction(code: any): Promise<any> {
  const headers = { Authorization: `Bearer ${this.token}` };
    // Simulating an async operation (like an HTTP request)
    return firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/api/transaction/create`, code, {
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

  getIfCatalogAvaliable(sku: any, qty: any, price: any): Promise<any> {
   const headers = { Authorization: `Bearer ${this.token}` };
    // Simulating an async operation (like an HTTP request)
    return firstValueFrom(
      this.http.post<any>(
        `${this.apiUrl}/api/transaction/create/${sku}/${qty}/${price}`,

        { headers }
      ).pipe(
        catchError(async (err) => {
          this.logService.saveLog(err.message);
          var config = await this.logService.getConfiguration();
          return throwError(err);
        })
      )
    );
  }

  createItem(order: FormData): Promise<any> {
    const headerDict = {
      Authorization: `Bearer ${this.token}`,
    };
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${this.token}`
    // });

    // const reqOptions = {
    //   headers: new HttpHeaders(reqHeaders)
    // };

    return firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/api/orders/create`, order, {
        headers,
      }).pipe(
        catchError(async (err) => {
          this.logService.saveLog(err.message);
          var config = await this.logService.getConfiguration();
          return throwError(err);
        })
      )
    );

    // return new Promise((resolve, reject) => {
    //   this.http
    //     .post<any>(`${this.apiUrl}/orders/create`, order, requestOptions)
    //     .pipe(
    //       catchError(async (err) => {
    //         if (err.status != 401) {
    //           console.log("Error Occured", err.message)
    //         }
    //         return null;
    //       })
    //     )
    //     .subscribe((data: any) => {
    //       resolve(data);
    //       //get.unsubscribe()
    //     }),
    //     (error: any) => {
    //       reject(error);
    //     };
    //   /*   }
    //   }) */
    // });
  }

  updateOrder(order: FormData): Promise<any> {
     const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    var t = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return new Promise((resolve, reject) => {
      /*    var get= this.authService.isAuthenticated$.subscribe((data:any) => {
        if(data==true){ */
      this.http
        .post<any>(`${this.apiUrl}/api/orders/edit`, order, { headers })
        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              //Rethrow it back to component
            }
            if (err.status == 500) {
            }
            return null;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
          //get.unsubscribe()
        }),
        (error: any) => {
          reject(error);
        };
      /*  }
    }) */
    });
  }

  editCode(code: any): Promise<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return new Promise((resolve, reject) => {
      /*  var get=  this.authService.isAuthenticated$.subscribe((data:any) => {
        if(data==true){ */
      this.http
        .put<any>(`${this.apiUrl}/api/code/edit`, code, { headers })
        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
            }
            return null;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
          //get.unsubscribe()
        }),
        (error: any) => {
          reject(error);
        };
      /*  }
  }) */
    });
  }

  sendBallance(event: any) {
    this._subject.next(event);
  }

  get events$() {
    return this._subject.asObservable();
  }

  // editBlance(balance: any): Promise<any> {
  //   const token: string =
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoieXNoYWlraEBleGFtcGxlLmNvbSIsImV4cCI6MTcxOTIyNjU1OSwiaXNzIjoiQ29kZU1hemVBUEkiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo1MDY3OS8ifQ.PPKpVal_3wSyJqfZMI7v5RA9M5PEDQ9u_gtmfHoj_JQ';
  //   const headers = { Authorization: `Bearer ${token}` };

  //   // Simulating an async operation (like an HTTP request)
  //   return firstValueFrom(
  //     this.http.put<any>(
  //       `https://clienttest.pinwhole.com/api/balance/edit`,
  //       balance,
  //       { headers }
  //     )
  //   );
  // }

  //   editBlance(balance:any):Promise<any>
  // {
  //   return new Promise((resolve, reject) => {
  //   /*  var get= this.authService.isAuthenticated$.subscribe((data:any) => {
  //       if(data==true){ */
  //     this.http.put<any>( 'https://clienttest.pinwhole.com/api/balance/edit',balance)
  //     .pipe
  //     (
  //       catchError(async(err) => {
  //         if(err.status!=401){

  //    }return null; })
  //     )
  //     .subscribe((data:any)=>{
  //       resolve(data)
  //       //get.unsubscribe()
  //     }

  //     ),
  //         (  error: any) => {
  //       reject(error);
  //     }
  //   /* }
  // }) */

  //   })
  // }
}
