import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environments';
import { LogService } from './log.service';
//import { LogService } from './log.service';
//import { AmendBillService } from 'src/app/Components/home/order-amend/order-bill/amend-bill.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: any = '';
  token: any = '';
  refreshToken: any = '';
  constructor(
    private http: HttpClient,
    private logService: LogService
  ) //  private sendMailService:AmendBillService
  {}
  public userData: any;
  public currentUserData: any;

  SetUerData(data: any) {
    this.userData = data;
  }
  GetUserData(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.userData);
    });
  }

  SetCurrentUser(data: any) {
    this.currentUserData = data;
    localStorage.setItem('currentUserData', this.currentUserData);
  }
  GetCurrenctUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      const currentUserData = localStorage.getItem('currentUserData');
      if (currentUserData) {
        resolve(this.currentUserData);
      }
      //console.log("this.currentUserData",this.currentUserData)
     
    });
  }
  // SetCurrentUser(userData: any): void {
  //   this.currentUserData = userData;
  //   localStorage.setItem('currentUserData', JSON.stringify(userData));
  // }

  getUserData(id: any): Promise<any> {
    var u = {
      userName: id,
    };
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.apiUrl + 'api/user/getUserById', u)

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              this.logService.saveLog(err.message);
              var config = await this.logService.getConfiguration();
              if (config.value == true)
                //this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

                return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }

  getUserDetails(clientID:any):Promise<any>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    var u = {
      userName: clientID,
    };
    return new Promise((resolve, reject) => {

      this.http.post<any>( '${this.apiUrl}/api/getUserById',u, {headers})
      .pipe
      (
        catchError(async(err) => {
          if(err.status!=401){
            //this.spinnerService.hide()       
  this.logService.saveLog(err.message)
  var config=await this.logService.getConfiguration();
  if(config.value==true)

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
  
  signout(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.apiUrl + 'account/revoke', id)

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              this.logService.saveLog(err.message);
              var config = await this.logService.getConfiguration();
              //if(config.value==true)
              //this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

              return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
  checkPhone(phone: any): Promise<any> {
    var obj = {
      PhoneNumber: phone,
    };
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.apiUrl + 'api/user/checkPhone', obj)

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              //this.logService.saveLog(err.message)
              // var config=await this.logService.getConfiguration();
              //if(config.value==true)
              //  this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

              return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
  AdminAddUser(body: any, role: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.apiUrl + 'api/user/createUser/' + role, body)

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              this.logService.saveLog(err.message);
              var config = await this.logService.getConfiguration();
              // if(config.value==true)
              //  this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

              return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
  GetUserById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(environment.apiUrl + '/api/user/getUserById/' + id)

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              this.logService.saveLog(err.message);
              var config = await this.logService.getConfiguration();
              //  if(config.value==true)
              //  this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

              return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
  checkEmail(email: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.apiUrl + 'api/user/checkEmail/' + email, null)

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              this.logService.saveLog(err.message);
              var config = await this.logService.getConfiguration();
              //   if(config.value==true)
              //    this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

              return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
  updateUserEmail(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.apiUrl + 'api/user/updateUserEmail', user)

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              this.logService.saveLog(err.message);
              var config = await this.logService.getConfiguration();
              //   if(config.value==true)
              //   this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

              return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
  checkUserOTP(code: any, user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.apiUrl + 'api/user/checkOTP/' + code, user)

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              this.logService.saveLog(err.message);
              var config = await this.logService.getConfiguration();
              //      if(config.value==true)
              //       this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

              return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
  AllActiveUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(environment.apiUrl + 'api/user/getAllActiveUsers')

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              this.logService.saveLog(err.message);
              var config = await this.logService.getConfiguration();
              //   if(config.value==true)
              //  this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

              return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
  AllUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(environment.apiUrl + 'api/user/getAllUsers')

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              this.logService.saveLog(err.message);
              var config = await this.logService.getConfiguration();
              //   if(config.value==true)
              //   this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

              return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
  DeleteUser(user: any): Promise<any> {
    var i = {
      Email: user,
    };
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.apiUrl + 'api/user/deleteUser', i)

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              this.logService.saveLog(err.message);
              var config = await this.logService.getConfiguration();
              //   if(config.value==true)
              //   this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

              return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
  EnableUser(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(environment.apiUrl + 'api/user/enableUser/' + user)

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              this.logService.saveLog(err.message);
              var config = await this.logService.getConfiguration();
              //   if(config.value==true)
              //   this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

              return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
  resetUserTOTP(email: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.apiUrl + 'api/user/resetTOTP/' + email, null)

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              this.logService.saveLog(err.message);
              var config = await this.logService.getConfiguration();
              //   if(config.value==true)
              //   this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

              return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
  updateUserData(user: any, active: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.apiUrl + 'api/user/updateUser/' + active, user)

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              this.logService.saveLog(err.message);
              var config = await this.logService.getConfiguration();
              //   if(config.value==true)
              //   this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

              return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
  adminChangePassword(user: any): Promise<any> {
  
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.apiUrl + '/api/user/adminChangePassword', user)

        .pipe(
          catchError(async (err) => {
            if (err.status != 401) {
              this.logService.saveLog(err.message);
              var config = await this.logService.getConfiguration();
              //   if(config.value==true)
              //   this.sendMailService.send("ereny.angular.ids@gmail.com",err.message,"error");

              return throwError(null);
            }
            return;
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
}
