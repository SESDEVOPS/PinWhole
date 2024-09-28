import { Component, OnInit } from '@angular/core';
import { UserService } from '../Services/user.service';
import { HelperService } from '../Services/helperService';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, DialogModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  userData: any;
  company: any = '';
  country: any = '';
  position: any = '';
  userName: any = '';
  userEmail: any = '';
  whiteIpError: any = '';
  clientID: any;
  ip = '';
  url = '';
  callBackObj: any;
  //flags
  check = false;
  showCallback = false;
  newURL = false;
  changePassword = false;
  hasPasswordMatchError = false;
  PasswordError = false;
  showChangePassword = false;
  Password = new FormControl('', [Validators.required]);
  cpassword = new FormControl('', [Validators.required]);

  changepasswordForm = new FormGroup({
    Password: this.Password,
    cpassword: this.cpassword,
  });

  constructor(
    private userService: UserService,
    private helperService: HelperService
  ) {}
  ngOnInit() {
    this.GetCurrenctUser();
  }
  showPasswordSuccess = false;

  HidePasswordSuccess(){
    this.showPasswordSuccess = false;
  }
  async UpdatePassword() {
    this.hasPasswordMatchError = false;
    //this.hasCodeMatchError= false;
    this.PasswordError = false;
    //this.resetPassError = false
    //console.log("this.changepasswordForm.valid",this.changepasswordForm.value.cpassword)
    //console.log("this.changepasswordForm.valid",this.changepasswordForm.value.Password)
    if (this.changepasswordForm.valid) {
      if (
        this.changepasswordForm.value.cpassword ===
        this.changepasswordForm.value.Password
      ) {
        var userAuth = {
          Email: this.userEmail,
          Password: this.changepasswordForm.value.Password,
        };

        this.helperService.adminChangePassword(userAuth).then(()=>
          {
          this.showPasswordSuccess = true;
          this.showChangePassword = false;
          });
      } else {
        this.hasPasswordMatchError = true;
      }
    } else {
      this.PasswordError = true;
    }
  }

  addIP() {
    var blocks = this.ip.split('.');
    //to check ip validabitiy
    if (blocks.length === 4) {
      this.check = true;
      blocks.forEach((block: any) => {
        var t = parseInt(block, 10) >= 0 && parseInt(block, 10) <= 255;
        if (t == false) {
          this.check = false;
        }
      });
    } else {
      this.check = false;
    }
    if (this.check == true) {
      var ipData = '';

      ipData = this.ip;

      var UserIp = {
        IP: ipData,
        ApplicationUserId: this.clientID,
      };
      this.helperService.createIP(UserIp).then((data: any) => {
        this.ip = '';
      });
    } else {
      this.whiteIpError = 'Add a valid IP address';
    }
  }

  async GetCurrenctUser() {
    this.clientID = localStorage.getItem('userID'); //this.userData.id
    this.company = localStorage.getItem('company');
    this.position = localStorage.getItem('position');
    this.userName = localStorage.getItem('userName');
    this.userEmail = localStorage.getItem('userEmail');
  }

  async ShowAndGetCallbacks() {
    this.showCallback = true;

    await this.helperService.getCallBack(this.clientID).then((data: any) => {
      //console.log("data----", data)
      if (data == null) {
        this.newURL = true;
      } else {
        this.callBackObj = data;
        this.newURL = false;
        this.url = data.callBackURL;
        //console.log("data.callBackURL",data.callBackURL)
      }
    });
  }

  async CreateURL() {
    var userCallBack: any = {
      ApplicationUserId: this.clientID,
      CallBackURL: this.url,
    };
    await this.helperService.createCallBack(userCallBack).then(() => {
      this.newURL = false;
    });
  }
  //edit callback url
  async EditURL() {
    if (this.callBackObj == undefined) {
      await this.helperService.getCallBack(this.clientID).then((data: any) => {
        this.callBackObj = data;
      });
    }
    this.callBackObj.callBackURL = this.url;
    await this.helperService.editCallBack(this.callBackObj).then(() => {
      alert('Updated ');
    });
  }
  ShowChangePassword() {
    this.showChangePassword = true;
  }
}
