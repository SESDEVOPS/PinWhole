import { Injectable } from '@angular/core';
import { LogService } from './log.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TransactionService
{
  token: any = '';
  refreshToken: any = '';
  clientID: any = '';
  constructor(private http: HttpClient,
    private logService:LogService,
   
    //public spinnerService: SpinnerService
   
    ) {   
      this.token = localStorage.getItem("token");
      this.refreshToken=localStorage.getItem("refreshToken");
      this.clientID = localStorage.getItem('userID');
    }
editTransaction(data:any):Promise<any>
{
  return new Promise((resolve, reject) => {

    this.http.put<any>( environment.apiUrl+'/api/transaction/edit',data)
    .pipe
    (
      catchError(async (err:any) => {
        if(err.status!=401){
           
this.logService.saveLog(err.message)

        return throwError(null);    
    }return null  })
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

     getTransactionById(Id:any):Promise<any>{
      var d = new Date()
      var timezoneOffset = d.getTimezoneOffset();
      return new Promise((resolve, reject) => {
  
        this.http.get<any[]>( environment.apiUrl+'/api/transaction/'+Id+'/'+timezoneOffset)
        .pipe
        (
          catchError(async (err) => {
            if(err.status!=401){
             // this.spinnerService.hide()     
    this.logService.saveLog(err.message)
   
            return throwError(null);    
              }return null        })
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
  getTransactions():Promise<any[]>{
    var d = new Date()
    var timezoneOffset = d.getTimezoneOffset();
    return new Promise((resolve, reject) => {
 
    this.http.get<any[]>( environment.apiUrl+'/api/transaction/'+timezoneOffset)
    .pipe
    (
      catchError(async (err) => {
        if(err.status!=401){
          //this.spinnerService.hide()    
this.logService.saveLog(err.message)

        return throwError(null);   
         }return null     })
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
addTransaction(code:any ):Promise<any>{
  const headers = { Authorization: `Bearer ${this.token}` };
  return new Promise((resolve, reject) => {

    this.http.post<any>(
    environment.apiUrl+'/api/transaction/create',
    code, {headers}
  )
  .pipe
  (
    catchError(async (err) => {
      if(err.status!=401){
        //this.spinnerService.hide() 
this.logService.saveLog(err.message)

      return throwError(null);    
   }return null })
  )
  .subscribe((data:any)=>{
    resolve(data)
  }

  ),
      (  error: any) => {
    reject(error);
  }


    });
}
getClientTransaction(user:any):Promise<any[]>{
  const headers = { Authorization: `Bearer ${this.token}` };
  var d = new Date()
  var timezoneOffset = d.getTimezoneOffset();
  return new Promise((resolve, reject) => {

  this.http.get<any[]>( environment.apiUrl+'/api/transaction/getAllClientTransaction/'+user+'/'+timezoneOffset, {headers})
  .pipe
  (
      catchError(async (err) => {
        if(err.status!=401){
          //this.spinnerService.hide() 
this.logService.saveLog(err.message)
var config=await this.logService.getConfiguration();
if(config.value==true)

      return throwError(null);    
     }return null   })
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
getClientTransactionLastMonths(user:any):Promise<any>{
  const headers = { Authorization: `Bearer ${this.token}` };
  var d = new Date()
  var timezoneOffset = d.getTimezoneOffset();
  return new Promise((resolve, reject) => {

  this.http.get<any>( environment.apiUrl+'/api/transaction/getClientLastMonthTransaction/'+user+'/'+timezoneOffset, {headers})
  .pipe
  (
    catchError(async (err) => {
      if(err.status!=401){
       // this.spinnerService.hide() 
this.logService.saveLog(err.message)
var config=await this.logService.getConfiguration();
if(config.value==true)

      return throwError(null);    
    }return null  })
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
getNextClientTransactionsLastMonth(clientID:any):Promise<any>{
  const headers = { Authorization: `Bearer ${this.token}` };
  var d = new Date()
  var timezoneOffset = d.getTimezoneOffset();
  return new Promise((resolve, reject) => {
  
  this.http.put<any>( environment.apiUrl+'/api/transaction/getClientLastMonthTransactionLoadMore/'+timezoneOffset,clientID,{headers})
  .pipe
  (
    catchError(async (err) => {
      if(err.status!=401){
        //this.spinnerService.hide()   
this.logService.saveLog(err.message)
var config=await this.logService.getConfiguration();
if(config.value==true)

      return throwError(null);   
    }return null  })
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
getClientTransactionPeriod(fromDate:any,toDate:any,user:any):Promise<any>{
  const headers = { Authorization: `Bearer ${this.token}` };
  var d = new Date()
  var timezoneOffset = d.getTimezoneOffset();
  return new Promise((resolve, reject) => {

  this.http.get<any>( environment.apiUrl+'/api/transaction/getClientTransactions/'+fromDate+'/'+toDate+'/'+user+'/'+timezoneOffset, {headers})
  .pipe
  (
    catchError(async (err) => {
      if(err.status!=401){
       // this.spinnerService.hide()   
this.logService.saveLog(err.message)
var config=await this.logService.getConfiguration();
if(config.value==true)

      return throwError(null);    
     }return null   })
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
getNextClientTransactionsPeriod(fromDate:any,toDate:any,clientID:any):Promise<any>{
  const headers = { Authorization: `Bearer ${this.token}` };
  var d = new Date()
  var timezoneOffset = d.getTimezoneOffset();
  return new Promise((resolve, reject) => {

  this.http.get<any>( environment.apiUrl+'/api/transaction/GetClientTransactionLloadMore/'+fromDate+'/'
  +toDate+'/'+clientID+'/'+timezoneOffset, {headers})
  .pipe
  (
    catchError(async (err) => {
      if(err.status!=401){
      //  this.spinnerService.hide() 
this.logService.saveLog(err.message)
var config=await this.logService.getConfiguration();
if(config.value==true)

      return throwError(null);    
   }return null })
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
getAdminTransactionLastMonths():Promise<any>{
  const headers = { Authorization: `Bearer ${this.token}` };
  var d = new Date()
  var timezoneOffset = d.getTimezoneOffset();
  return new Promise((resolve, reject) => {

  this.http.get<any>( environment.apiUrl+'/api/transaction/getAdminLastMonthTransaction/'+timezoneOffset, {headers})
  .pipe
  (
    catchError(async (err) => {
      if(err.status!=401){
    //   this.spinnerService.hide()   
this.logService.saveLog(err.message)
var config=await this.logService.getConfiguration();
if(config.value==true)

      return throwError(null);   
    }return null  })
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
getNextAdminTransactionsLastMonth(obj:any):Promise<any>{
  const headers = { Authorization: `Bearer ${this.token}` };
  var d = new Date()
  var timezoneOffset = d.getTimezoneOffset();
  return new Promise((resolve, reject) => {

  this.http.put<any>( environment.apiUrl+'/api/transaction/getAdmintLastMonthTransactionLoadMore/'+
  obj+'/'+timezoneOffset,null, {headers})
  .pipe
  (
    catchError(async (err) => {
      if(err.status!=401){
       //this.spinnerService.hide()   
this.logService.saveLog(err.message)
var config=await this.logService.getConfiguration();
if(config.value==true)

      return throwError(null);    
     }return null   })
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
getAdminTransactionPeriod(fromDate:any,toDate:any,user:any):Promise<any[]>{
  const headers = { Authorization: `Bearer ${this.token}` };
  var d = new Date()
  var timezoneOffset = d.getTimezoneOffset();
  return new Promise((resolve, reject) => {

  this.http.get<any[]>( environment.apiUrl+'/api/transaction/getAdminTransactions/'+fromDate+'/'+
  toDate+'/'+user+'/'+timezoneOffset, {headers})
  .pipe
  (
    catchError(async (err) => {
      if(err.status!=401){
        //this.spinnerService.hide() 
this.logService.saveLog(err.message)
var config=await this.logService.getConfiguration();
if(config.value==true)

      return throwError(null);   
  }return null})
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
getNextAdminTransactionsPeriod(fromDate:any,toDate:any,clientID:any):Promise<any>{
  const headers = { Authorization: `Bearer ${this.token}` };
  var d = new Date()
  var timezoneOffset = d.getTimezoneOffset();
  return new Promise((resolve, reject) => {

  this.http.get<any>( environment.apiUrl+'/api/transaction/GetAdminTransactionLloadMore/'+fromDate+'/'
  +toDate+'/'+clientID+'/'+timezoneOffset, {headers})
  .pipe
  (
    catchError(async (err) => {
      if(err.status!=401){
        //this.spinnerService.hide()  
this.logService.saveLog(err.message)
var config=await this.logService.getConfiguration();
if(config.value==true)

      return throwError(null);    
     }return null   })
  )
  .subscribe((data:any)=>{
    resolve(data)
  }

  ),
      (  error: any) => {
    reject(error);
  }
     /*  }
    }) */
})
}
}
