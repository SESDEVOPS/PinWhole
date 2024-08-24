import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";

@Injectable({
    providedIn: 'root',
  })
  export class LogService
  {
    constructor(private http: HttpClient) {}
      getConfiguration():Promise<any>
      {
       
        return new Promise((resolve, reject) => {
          this.http.get<any>( environment.apiUrl+'/api/Log/config')
    
          .subscribe((data:any)=>{
            resolve(data)
          }
    
          ),
              (  error: any) => {
            reject(error);
          }
    
        })
      }
     // check code exists
     saveLog(message:any):Promise<any>
     {
        var log=
        {
            methodName:"angular",
            errMessage:message
        }
       return new Promise((resolve, reject) => {
         this.http.post<any>( environment.apiUrl+'api/Log/saveLog',log)
   
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