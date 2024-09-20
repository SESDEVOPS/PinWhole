import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../Services/auth.service';
import { AuthenticateService } from '../Services/authenticate.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { HelperService } from '../Services/helperService';

@Component({
  selector: 'app-register-user',
  standalone: true,

  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    PasswordModule,
    DividerModule, 
    CardModule,
    ButtonModule,
    DialogModule,
  ],
  

  


  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css',
})
export class RegisterUserComponent implements OnInit {
  showRegSuccess = false;
  invalidClass = 'is-invalid';
  disabledClass = 'disabled';
  passwordHasCapital = false;
  passwordHasSmall = false;
  passwordHasNumber = false;
  passwordIsRequiredLength = false;
  isPasswordValid = false;
  user: any;
  userEmail = new FormControl('', [Validators.email, Validators.nullValidator]);
  userPassword = new FormControl('', [
    Validators.minLength(10),
    Validators.nullValidator,
    Validators.pattern('[A-Z|a-z]+[0-9]+[@#$&]*'),
  ]);
  userName = new FormControl('', [Validators.nullValidator]);
  userPhone = new FormControl('', [Validators.nullValidator]);
  //userCompany = new FormControl('', [Validators.required]);
  userCountry = new FormControl('', [Validators.required]);
  userBusinessName = new FormControl('', [Validators.required]);
  userBusinessRegistration = new FormControl('', [Validators.required]);
  userBusinessTaxNo = new FormControl('', [Validators.nullValidator]);
  userBusinessVolume = new FormControl('', [Validators.required]);
  userBusinessCategory  = new FormControl('', [Validators.required]);

  //businessCategory =  new FormControl('Select Business Category', [Validators.required]);
  registerForm = new FormGroup({
    userEmail: this.userEmail,
    userPassword: this.userPassword,
    userName: this.userName,
    userPhone: this.userPhone,
    //userCompany: this.userCompany,
    userCountry: this.userCountry,
    userBusinessName: this.userBusinessName,
    userBusinessRegistration: this.userBusinessRegistration,
    userBusinessTaxNo: this.userBusinessTaxNo,
    userBusinessVolume: this.userBusinessVolume,
    userBusinessCategory: this.userBusinessCategory,
  });
  value!: string;
  showError: any = false;
  error: any = "";
  constructor(
    private router: Router,
    private authService: AuthenticateService,
    private helperService: HelperService
  ) 
  {}
  ngOnInit() {
   this. getCountries();
  }

  username: any;
  pwd: any;
  email: any;
  name: any;
  phone_number: any;
  company: any;
  position: any;
  country: any;
  taxNo:any;
  businessRegNo: any;
  businessVol: any;
  selectedBCategory: string = '';
  async RegisterUser() {
    // console.log("this.registerForm.get('userBusinessVolume')",this.registerForm.value.userBusinessVolume)
    // return
    
    this.user = await this.authService.registerUser({
      username: this.username,
      password: this.pwd,      
        email: this.email,
        name: this.username,       
        phoneNumber: this.phone_number,        
        company:this.company,
        position:"",
        country:this.registerForm.value.userCountry,
        taxId : this.taxNo,
        expectedPurchase : this.registerForm.value.userBusinessVolume, //this.businessVol,
        businessRegistration : this.businessRegNo,
        businessCategoryID : this.registerForm.value.userBusinessCategory,
       
      
      
    }).then((res:any)=>
    {
      //console.log("dsa",res)
    if(res.status=="Error")
    {
    this.showError=true;
    this.error=res.message;
    }
    else if(res.status=="Success")
    {
      //redirect to home page 
      //this.router.navigate(['login']);
      this.showRegSuccess = true;
    }
    })

  }
  countries: any;
  async getCountries(){
    await this.helperService.getCountries().then((data)=>{
      this.countries = data;
    })

    console.log("this.countries",this.countries)
  }

  showPasswordHelp() {
    console.log('showPasswordHelp');
  }

  goToLogin(){
    this.showRegSuccess = false;
    this.router.navigate(['login']);
  }

  checkPasswordCriteria(event: any) {
    var password = event.target.value;
    if (password.length >= 10) {
      this.passwordIsRequiredLength = true;
    } else {
      this.passwordIsRequiredLength = false;
    }

    for (let i = 0; i < password.length; i++) {
      if (password[i].charCodeAt(0) >= 65 && password[i].charCodeAt(0) <= 90) {
        this.passwordHasCapital = true;
        break;
      } else {
        this.passwordHasCapital = false;
      }
    }
    for (let i = 0; i < password.length; i++) {
      if (password[i].charCodeAt(0) >= 97 && password[i].charCodeAt(0) <= 122) {
        this.passwordHasSmall = true;
        break;
      } else {
        this.passwordHasSmall = false;
      }
    }
    for (let i = 0; i < password.length; i++) {
      if (password[i].charCodeAt(0) >= 48 && password[i].charCodeAt(0) <= 57) {
        this.passwordHasNumber = true;
        break;
      } else {
        this.passwordHasNumber = false;
      }
    }

    // if(this.passwordHasCapital && this.passwordHasSmall && this.passwordHasNumber && this.passwordIsRequiredLength){
    // this.isPasswordValid = true;
    // }
    
  }

 
}
