import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticateService } from '../Services/authenticate.service';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { HttpClientModule } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthenticationService } from '../Services/authentication.service';
import { UserService } from '../Services/user.service';
import { AuthService } from '../Services/auth.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    FloatLabelModule,   
    HttpClientModule,
    ProgressSpinnerModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    PasswordModule,
    DividerModule, 
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  signup_email: string = '';
  signup_password: string = '';
  name: string = '';
  phoneNumber: string = '';
  address: string = '';
  birthdate: string = '';
  code: string = '';
  role: any;
  error: any;
  hasError: boolean = false;
  //flags
  hide = true;
  showGoogleCodeDialog = false;
  isSignedUp: boolean = true;
  public isLogged = false;
  isSignIn = true;
  gCodeValue:  string = '';
  myQrCode: any = null;
  dataAfterSignSuccess: any = null;
  formGroupGoogleCode: FormGroup | any;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passFormControl = new FormControl('', [Validators.required]);

  loginForm = new FormGroup({
    emailFormControl: this.emailFormControl,
    passFormControl: this.passFormControl,
  });

  gCode = new FormControl('', [
    Validators.required,
  ]);

  constructor( private router: Router,
   
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private  authService: AuthService,
  ) {

    this.formGroupGoogleCode = new FormGroup({
      gCode: this.gCode,    
    });
  }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }
  async signIn() {
    //debugger;
    this.error = '';
    await this.authenticationService
      .Login({email: this.email, password: this.password })
      .then((res) => {
        if (res.isAuthSuccessful == false) {
          console.log("Error-" , res.errorMessage)
          this.hasError = true;
          this.error = res.errorMessage;
        } else if (res.isAuthSuccessful == true) {
          this.hasError = false;
          //console.log("res.type",res.type)
          res.type = 'first';
          if (res.type == 'first') {
            var u =
              'otpauth://totp/PinWhole:' +
              this.email +
              '?secret=' +
              res.totp.manualEntryKey;

            this.showGoogleCodeDialog = true;
            this.dataAfterSignSuccess = {
              data: {
                dataKey: u,
              },
            };
            this.myQrCode = this.dataAfterSignSuccess.dataKey;
           
          } else if (res.type == 'last') {
            // this.dialog
            //   .open(CodeComponent)
            //   .afterClosed()
            //   .subscribe((code: any) => {
            //     this.manageValidationCode(code);
            //   });
          } else {
          }
        }
      });
  }

  submitData(event: any) {
    if (event.keyCode === 13) {
      //this.add()
    }
  }

  add() {
    this.manageValidationCode(this.gCodeValue);

  }

  manageValidationCode(code: any) {
   // console.log("code",this.gCodeValue);
    this.authenticationService
      .ValidateToTP(code, { email: this.email, password: this.password })
      .then((res) => {
        console.log('Successfull', res);
        if (res.isAuthSuccessful == false) {
          this.hasError = true;
          this.error = res.errorMessage;
        } else if (res.isAuthSuccessful == true) {
          this.hasError = false;         
         
          this.authService.signIn(res)
          this.userService.SetCurrentUser(res.user)
          this.router.navigate(['home']);
        } else {
        }
      });
  }
}
