import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, firstValueFrom, throwError } from 'rxjs';
import { LogService } from './log.service';
import { environment } from '../../environments/environments';
@Injectable({
  providedIn: 'root'
})


export class CommissionService
{
  apiUrl: any = ''; 
  token: any = '';
  refreshToken: any = '';
  constructor(private http: HttpClient,
    private logService:LogService,
   ) {

    this.apiUrl = environment.apiUrl;
    this.token = localStorage.getItem("token");
    this.refreshToken=localStorage.getItem("refreshToken")
   }
    editExchange(status:any):Promise<any>{
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      });
      // return firstValueFrom(
      
      //   this.http.put<any>( environment.apiUrl+'api/exchangeRate/editExchange',status)
      //     .pipe(
      //       catchError(async (err) => {
      //         this.logService.saveLog(err.message);
      //         var config = await this.logService.getConfiguration();
      //         return throwError(err);
      //       })
      //     )
      // );
      

      return new Promise((resolve, reject) => {
        this.http.put<any>( environment.apiUrl+'/api/exchangeRate/editExchange',status,{
          headers,
        })
       
        .pipe(
          catchError(async (err) => {
            this.logService.saveLog(err.message);
            var config = await this.logService.getConfiguration();
            return throwError(err);
          })
        )
        .subscribe((data:any)=>{
          resolve(data)
        }
  
        ),
            (  error: any) => {
          reject(error);
        }
  
      })
    }
   getExchangeRate(status:any):Promise<any>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return new Promise((resolve, reject) => {
      this.http.get<any>( environment.apiUrl+'/api/exchangeRate/'+status, {
        headers,
      })
     
      .pipe
      (
        catchError(async(err) => {
        
          if(err.status!=401){
            this.logService.saveLog(err.message)
            var config=await this.logService.getConfiguration();
            if(config.value==true)
         
                    return throwError(null);   
                    }
                    return null;
        })
      )
      .subscribe((data:any)=>{
        resolve(data)
      }

      ),
          (  error: any) => {
        reject(error);
      }

    })
  }
  getAllExchanges():Promise<any>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return new Promise((resolve, reject) => {
      this.http.get<any>( environment.apiUrl+'/api/exchangeRate/' ,  {
        headers,
      })
     
      .pipe
      (
        catchError(async(err) => {
        
  this.logService.saveLog(err.message)
  var config=await this.logService.getConfiguration();

          return throwError(null);    
        }
        )
        
      )
      .subscribe((data:any)=>{
        resolve(data)
      }

      ),
          (  error: any) => {
        reject(error);
      }

    })
  }
    getEXchangeById(statusID:any):Promise<any>{
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      });
      return new Promise((resolve, reject) => {
        this.http.get<any>( environment.apiUrl+'/api/exchangeRate/getStatusById/'+statusID,  {
          headers,
        })
       
        .pipe
        (
          catchError(async(err) => {
          
    this.logService.saveLog(err.message)
    var config=await this.logService.getConfiguration();
  
            return throwError(null);    
          })
        )
        .subscribe((data:any)=>{
          resolve(data)
        }
  
        ),
            (  error: any) => {
          reject(error);
        }
  
      })
    }
}