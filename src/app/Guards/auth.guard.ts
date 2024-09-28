import { CanActivate, CanActivateFn, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { AuthenticationService } from '../Services/authentication.service';
import { Observable } from 'rxjs';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate():
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    // console.log(
    //   'this.authService.isAuthenticated',
    //   this.authService.isAuthenticated
    // );

    if (this.authService.isAuthenticated) {
      return true;
    } else {
      // Redirect to login with the return URL
      return this.router.createUrlTree(['login']);
    }
  }
}
