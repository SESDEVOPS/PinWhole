import { Component, OnInit } from '@angular/core';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userData:any;
  company:string='';
  country:string='';
  position:string='';
  whiteIpError:any="";
  clientID:any;
  ip=""
  url=""
  callBackObj:any;
  //flags
   check=false
   showCallback=false
   newURL=false;

   constructor( private userService: UserService)
   {}
  ngOnInit() {
    this.GetCurrenctUser();
  }
  GetCurrenctUser()
 {
  this.userService.GetCurrenctUser()
  .then((user: any) => {
   // console.log("User", user);
    this.userData = user;
    this.clientID=this.userData.id
    this.company=this.userData.company;
    this.position=this.userData.position;
    this.country=this.userData.country;
  
  }).
  catch((e:any)=>{


  }) 
 }

}
