import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Subject, firstValueFrom, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environments';
import { LogService } from './log.service';
//import { LogService } from './log.service';
//import { AmendBillService } from 'src/app/Components/home/order-amend/order-bill/amend-bill.service';
@Injectable({
  providedIn: 'root',
})
export class AuthenticateService
{
  apiUrl: any = ''; 
  token: any = '';
  

    constructor(private http: HttpClient,private logService: LogService
        //private logService:LogService,
       // private sendMailService:AmendBillService
       ) {
        this.apiUrl = environment.apiUrl;
    this.token = localStorage.getItem("token");
   
       }
        registerAdmin(body:any):Promise<any>{
          return new Promise((resolve, reject) => {
            this.http.post<any>( environment.apiUrl+'account/registerAdmin',body)
           
            .pipe
            (
              catchError(async(err) => {
              
                if(err.status!=401){
                  //this.logService.saveLog(err.message)
                 // var config=await this.logService.getConfiguration();
                  //if(config.value==true)
                
                        //  return throwError(null);   
                          }
                          return;
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


        registerUser(body:any):Promise<any>{
          console.log("body", body);
          const headers = new HttpHeaders({
            Authorization: `Bearer ${this.token}`,
          });
      
          return firstValueFrom(
            this.http
              .post<any>(`${environment.apiUrl}/account/register`, body, {
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


        // registerUse1(body:any):Promise<any>{

        //   console.log('Here',body);
        //     return new Promise((resolve, reject) => {

        //       this.http.post<any>( environment.apiUrl+'/account/register',body)
             
        //       .pipe
        //       (
        //         catchError(async(err) => {
                
        //           if(err.status!=401){
        //            // this.logService.saveLog(err.message)
        //            // var config=await this.logService.getConfiguration();
        //            // if(config.value==true)
                
        //                     return throwError(null);   
        //                     }
        //                     return;
        //         })
        //       )
        //       .subscribe((data:any)=>{
        //         resolve(data)
                
        //       }
        
        //       ),
        //           (  error: any) => {
        //         reject(error);
        //       }
        
        //     })
        //   }
          login(body:any):Promise<any>{
            console.log("body",body)
            return new Promise((resolve, reject) => {
              this.http.post<any>(environment.apiUrl+'/account/login',body)
             
              .pipe
              (
                catchError(async(err) => {
                
                  if(err.status!=401){
                  //  this.logService.saveLog(err.message)
                  //  var config=await this.logService.getConfiguration();
                //    if(config.value==true)
                 
                            return throwError(null);    
                            }
                            return;
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
          ToTP(body:any):Promise<any>{
            return new Promise((resolve, reject) => {
              this.http.post<any>( environment.apiUrl+'account/totp',body)
             
              .pipe
              (
                catchError(async(err) => {
                
                  if(err.status!=401){
                   // this.logService.saveLog(err.message)
                //    var config=await this.logService.getConfiguration();
                 //   if(config.value==true)
                
                            return throwError(null);   
                            }
                            return;
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
          ValidateToTP(code:any,body:any):Promise<any>{
            return new Promise((resolve, reject) => {
              this.http.post<any>( environment.apiUrl+'account/validateTotp/'+code,body)
             
              .pipe
              (
                catchError(async(err) => {
                
                  if(err.status!=401){
                   // this.logService.saveLog(err.message)
                  //  var config=await this.logService.getConfiguration();
                  //  if(config.value==true)
                
                            return throwError(null);    
                            }
                            return;
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
          refreshToken(body:any){
            return  this.http.post<any>( environment.apiUrl+'account/refresh-token',body)
             
             
        
            
          }
}
