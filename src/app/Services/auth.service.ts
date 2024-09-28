import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { delay, map } from 'rxjs/operators';
//import { MatDialog } from '@angular/material/dialog';
//import { AuthenticatorComponent } from 'src/app/Components/auth/authenticator/authenticator.component';
//import { CodeComponent } from 'src/app/Components/auth/code/code.component';
//import { NotifyMessageComponent } from 'src/app/Components/shared/components/notify-message/notify-message.component';
import { UserService } from '../Services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAuthenticated: BehaviorSubject<any> = new BehaviorSubject<any>(
    false
  );
  private _role: BehaviorSubject<any> = new BehaviorSubject<any>([]);
private token:any;
  public isAuthenticated$: Observable<any> =
    this._isAuthenticated.asObservable();

  private _user: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  public user$: Observable<any> = this._user.asObservable();

  public role$: Observable<any> = this._role.asObservable();

  constructor(private router: Router,
    //private dialog: MatDialog,
    private userService:UserService
    ) { }
  // get role


  public async authValidate() {
    try {
      // localStorage.getItem('store_owner_ad_contacts');
    this.token=localStorage.getItem("token")
      if (this.token!= null) {
      
       
     await this.userService.GetUserById(localStorage.getItem("userID"))
      .then(async (us:any)=>{
       await this.userService.SetCurrentUser(us)
      
      })
        this._isAuthenticated.next(true);
        var r=localStorage.getItem("role")
        this._role.next(r);
        var id=localStorage.getItem("userID")
      } else {
        this.router.navigate(['login']);
        this._isAuthenticated.next(false);
      }
    } catch (error) {
      this.router.navigate(['login']);
      this._isAuthenticated.next(false);
    }
  }
async activate()
{
  this._isAuthenticated.next(true);
}
  async signIn(res:any) {
    try {
    //  console.log("res",res)
          this._isAuthenticated.next(true);
         this._role.next(res.role)
         localStorage.setItem("token",res.token)
         localStorage.setItem("refreshToken",res.refreshToken)
         localStorage.setItem("role",res.role)
         localStorage.setItem("userID",res.user.id)
         localStorage.setItem("userName",res.user.loggedName)
         localStorage.setItem("userEmail",res.user.email)         
         localStorage.setItem("position",res.user.position)
         localStorage.setItem("company",res.user.company)
         

         
         localStorage.setItem("RefreshError","False")
           this.router.navigate(['head']); 
  this.token=res.token
        
       


    
    } catch (error: any) {
      this._isAuthenticated.next(false);
      return (error.message);
    }
  }

   public async signout() {
    try {
     // await Auth.signOut();
     var user:any;
     this.userService.GetCurrenctUser().then((data:any)=>
     {user=data
     var t={
userName:user.email
     }
      this.userService.signout(t)
    });
     
      this._isAuthenticated.next(false);
      localStorage.setItem("token","")
         localStorage.setItem("refreshToken","")
         localStorage.setItem("role","")
         localStorage.setItem("userID","")
         localStorage.setItem("RefreshError","False")
      localStorage.clear();
      this.userService.SetCurrentUser(null)
      this._role.next([])
      this.router.navigate(['login']);
    } catch (error) {
    }
  }
  public async signoutAll() {
    try {
      //await Auth.signOut({ global: true });
      this._isAuthenticated.next(false);
      localStorage.clear();
      this.userService.SetCurrentUser(null)
      this.router.navigate(['login']);
    } catch (error) {
    }
  }
  /*
  //forget password
  public async forgetPassword(email: string) {
    try {
      await Auth.forgotPassword(email);
    }
    catch (error) {
    }
  } */
}
