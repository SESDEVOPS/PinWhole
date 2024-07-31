import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderItem, OrderItemDetails } from '../Models/item-model';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { OrderToProceed } from '../Models/ordertoprocess';
import { environment } from '../../environments/environments';
import { firstValueFrom, throwError } from 'rxjs';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class ItemService {
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
  public items = [];

  //   getProducts(): Observable<OrderItem[]> {
  //     return this.http.get<OrderItem[]>(this.apiUrl);
  //   }

  getAllItems(): Observable<OrderItem[]> {
    const headers = { Authorization: `Bearer ${this.token}` };
    return this.http
      .get<{ allItems: OrderItem[] }>(`${this.apiUrl}/api/items/getItems`, {
        headers,
      })
      .pipe(map((response) => response.allItems));
  }

  getItemDetails(itemID: number): Observable<OrderItemDetails[]> {
    const headers = { Authorization: `Bearer ${this.token}` };
    return this.http
      .get<OrderItemDetails[]>(
        `${this.apiUrl}/api/Code/getByItemID/${itemID}`,
        {
          headers,
        }
      )
      .pipe(map((response) => response));
  }

  createItem(orderToProceed: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    });

    return this.http.post<any>(
      `${this.apiUrl}/api/Orders/create`,
      orderToProceed,
      { headers }
    );
  }

  updateOrderStatus(order: FormData): Promise<any> {
    var t = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const headers = { Authorization: `Bearer ${this.token}` };
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${this.apiUrl}/api/orders/editStatus/`, order, {
        headers,
      });
    });
  }

  getMoreItems(itemCountToFetch: any): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };
    // Simulating an async operation (like an HTTP request)
    return firstValueFrom(
      this.http.put<any>(
        `${this.apiUrl}/api/items/getItemsLoadMore`,
        itemCountToFetch,
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

  getItemContainLettters(itemName: any): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };
    // Simulating an async operation (like an HTTP request)
    return firstValueFrom(
      this.http.get<any>(
        `${this.apiUrl}/api/items/getItemContainLettters/${itemName}`,
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

  clientPendingOrders(): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };
    var d = new Date();
    var timezoneOffset = d.getTimezoneOffset();
    return firstValueFrom(
      this.http.get<any[]>(
        environment.apiUrl +
          `/api/orders/clientPendingOrders/${this.clientID}/${timezoneOffset}`, { headers }
      ).pipe(
        catchError(async (err) => {
          this.logService.saveLog(err.message);
          var config = await this.logService.getConfiguration();
          return throwError(err);
        })
      )
    );
  }


  clientAllOrders(): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };
    var d = new Date();
    var timezoneOffset = d.getTimezoneOffset();
    return firstValueFrom(
      this.http.get<any[]>(
        environment.apiUrl +
          `/api/orders/clientOrders/${this.clientID}/${timezoneOffset}`, { headers }
      ).pipe(
        catchError(async (err) => {
          this.logService.saveLog(err.message);
          var config = await this.logService.getConfiguration();
          return throwError(err);
        })
      )
    );
  }

  clientAllArchiveOrders(): Promise<any> {
    const headers = { Authorization: `Bearer ${this.token}` };
    var d = new Date();
    var timezoneOffset = d.getTimezoneOffset();
    return firstValueFrom(
      this.http.get<any[]>(
        environment.apiUrl +
          `/api/orders/clientArchiveOrders/${this.clientID}/${timezoneOffset}`, { headers }
      ).pipe(
        catchError(async (err) => {
          this.logService.saveLog(err.message);
          var config = await this.logService.getConfiguration();
          return throwError(err);
        })
      )
    );
  }

  getClientDraftOrders(clientID: any): Promise<any> {
    //debugger;
    const headers = { Authorization: `Bearer ${this.token}` };
    var d = new Date();
    var timezoneOffset = d.getTimezoneOffset();
    return firstValueFrom(
      this.http.get<any[]>(
        environment.apiUrl +
          `/api/orders/clientDraftOrders/${clientID}/${timezoneOffset}`, { headers }
      ).pipe(
        catchError(async (err) => {
          this.logService.saveLog(err.message);
          var config = await this.logService.getConfiguration();
          return throwError(err);
        })
      )
    );
  }





  //   return new Promise((resolve, reject) => {
  //     this.http
  //       .get<any[]>(
  //         environment.apiUrl +
  //           `/api/orders/clientPendingOrders/${this.clientID}/${timezoneOffset}`
  //       )
  //       .pipe(
  //         catchError(async (err) => {
  //           this.logService.saveLog(err.message);
  //           var config = await this.logService.getConfiguration();
  //           return throwError(err);
  //         })
  //       );
  //   });
  // }
}
