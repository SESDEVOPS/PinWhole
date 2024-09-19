import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ItemService } from '../Services/itemservice';
import { HelperService } from '../Services/helperService';
import { UserService } from '../Services/user.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DialogModule, CommonModule, RouterModule],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.css',
})
export class ForgetpasswordComponent {
  newpassword: boolean = false;
  activeCode: boolean = false;
  activeMail: boolean = true;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  codeFormControl = new FormControl('', [Validators.required]);
  Password= new FormControl('', [Validators.required]);
  cpassword= new FormControl('', [Validators.required]);
  constructor(
    private router: Router,
    private itemservice: ItemService,
    private helperService: HelperService,
    private userService: UserService
  ) {}

  //form

  signupForm = new FormGroup({
    emailFormControl: this.emailFormControl,
  });
  codeForm = new FormGroup({
    codeFormControl: this.codeFormControl,
  });

  newpasswordForm = new FormGroup({
    Password: this.Password,
    cpassword: this.cpassword,
    
  });
  OTPValue: any;
  OTP:any;
  email: any;
  hassError = false;
  showcodeInEmailPopup = false;
  bshowCodePanel = false;
  async forget() {
    this.hassError = false;
    //alert(this.email)
    //console.log("this.signupForm.valid",this.signupForm.valid)
    if (this.signupForm.valid) {
      this.OTPValue = Math.floor(1000 + Math.random() * 9000);
      console.log("this.OTPValu",this.OTPValue)
      var Subject = ' OTP - Forget Password ';
      var message =
        'Dear Partner;;' + 'Your One Time Pin is : ' + this.OTPValue;
      await this.helperService
        .send(this.signupForm.value.emailFormControl, message, Subject)
        .then(() => {
          this.bshowCodePanel = true;
          this.showcodeInEmailPopup = true;        
          this.activeCode = true;
          this.activeMail = false;
          
        })
        .catch((error) => {});
    } else {
      this.hassError = true;
    }
  }

  showCodePanel() {
    this.showcodeInEmailPopup = false;
    
  }
  hasCodeError = false;
  code() {
    this.showcodeInEmailPopup = false;
    //console.log("this.codeForm.valid",this.codeForm.valid)
    //console.log("this.OTPValue",this.OTPValue)
    if (this.codeForm.valid) {

      this.newpassword = true;
      this.activeCode = false;
      this.activeMail = false;
    }
    {
      this.hasCodeError = true;
    }
  }

  oPassword: any;
  npassword: any;
  hasPasswordMatchError = false;
  hasCodeMatchError= false;
  PasswordError= false;
  resetPassError = false
  async reset(){
    this.hasPasswordMatchError= false;
    this.hasCodeMatchError= false;
    this.PasswordError = false;
    this.resetPassError = false

      if(this.newpasswordForm.valid){

        if(this.newpasswordForm.value.cpassword===this.newpasswordForm.value.Password)
        {
         if(this.codeForm.value.codeFormControl==this.OTPValue){
         var model={
           Email:this.signupForm.value.emailFormControl,
           Password:this.newpasswordForm.value.Password
         }
         await this.helperService.adminChangePassword(model)
         .then((value)=>{
          console.log("value.challengeName",value)
          if(value.challengeName == undefined)
          {
            this.resetPassError = true;
          }
          else
          {
            this.router.navigate(['/login'])
          }
         
         }
   
         )
         .catch((error)=>{})
       }
       else
       {
        
        this.hasCodeMatchError= true;
       }
        }
        else{
          this.hasPasswordMatchError = true;
        }
       }
       else
       {
        this.PasswordError = true;
       }

  }
}
