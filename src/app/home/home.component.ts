import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RegisterUserComponent } from '../register-user/register-user.component';
import { OrderIndexComponent } from '../order-index/order-index.component';
import { BalanceService } from '../Services/balance.service';
import { AuthService } from '../Services/auth.service';
import { UserService } from '../Services/user.service';
import { WalletService } from '../Services/wallet.service';
import { HelperService } from '../Services/helperService';
import { ItemService } from '../Services/itemservice';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { MenuItem ,MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    RegisterUserComponent,
    OrderIndexComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    SplitButtonModule, ToastModule,
    CommonModule
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  balance: any = 0;
  currentBal: any = 0;
  userData: any;
  role:any;
  isAdmin:any=false;
  clientID:any;
  draftItems:any=0;
  items: MenuItem[];
  dropdownItems = ['Option 1', 'Option 2', 'Option 3'];
  constructor(
    private balanceService: BalanceService,
    private userService: UserService,
    private authService: AuthService,
    private walletService:WalletService,
    private helperservice: HelperService,
    private itemservice: ItemService,
    private router: Router,
  ) {
    this.items = [ { label: 'Angular Website', url: 'http://angular.io' },];
    // this.onWindowScroll();
  }
  async ngOnInit() {
    this.authService.authValidate();
   // await this.GetClientUSDBalance();
    await this.GetUserDetails();
    await this.CheckClientRoleWithAction();
    
  }
  save(){
    
  }
  async GetClientUSDBalance() {

    await this.userService.GetCurrenctUser().then((data)=>
      {
    this.clientID=data?.id;
    this.userData = data
     this.helperservice.getBalanceByclientIdandCurrencyAsync(this.clientID,"USD").then((data:any)=>
  {
    if(data!=null&&data!=undefined)
    {
      this.balance=data.balance.toFixed(2)
    }
  }) 
      }) 
    // // // // // await this.balanceService
    // // // // //   .GetClientBalance()
    // // // // //   .then((data) => {
    // // // // //     if (data != null) {
    // // // // //       this.balance = data.balance;
    // // // // //       //this.getCurrentBalance();
    // // // // //     }
    // // // // //   })
    // // // // //   .catch((error) => {
    // // // // //     console.error('Error fetching Ezpin details:', error);
    // // // // //   });





    // await this.userService.GetCurrenctUser().then((data)=>
    //       {
    //     this.clientID=data?.id;
    //     this.userData = data
    //     this.balanceService.GetBalanceByclientIdandCurrencyAsync("USD").then((data:any)=>
    //   {
    //     if(data!=null&&data!=undefined)
    //     {
    //       this.balance=data.balance.toFixed(2)
    //     }
    //   })
    //       })
  }

  getCurrentBalance()
  {
    this.currentBal =  this.balanceService.getUpdatedBalance(this.balance);
    //console.log("getCurrentBalance()",this.currentBal );
  }
  async GetUserDetails() {
    await this.userService.GetCurrenctUser().then((data) => {
      this.userData = data;
      //console.log("this.userData",this.userData)
    });
  }

  //get draft order count for bell notification
  getDraftCount = async () => {
    await this.GetClientUSDBalance();
    var prependingOrderCount: any = 0;

    if(this.clientID!=undefined){
      await this.itemservice.getClientDraftOrders(this.clientID).then((data)=>
      {
        if(data!=null){
       prependingOrderCount= data.length
       if(typeof prependingOrderCount == 'number')
       this.draftItems=prependingOrderCount;
      else
      this.draftItems=0;

        }
      })
    }
  };

  async CheckClientRoleWithAction()
{
  await this.authService.role$.subscribe(async (data) => {
    if(data){
    this.role = data;
  if(this.role=="Admin"){
  this.isAdmin=true}
  else if (this.role=="User")
  {
      //getting wallet
      this.walletService.events$.forEach(event=>
        {
          this.balance=event;
          this.balance=Number( this.balance).toFixed(2);
  
  
        })
        //getting draft items
    await  this.getDraftCount();
  
      
  }
  }
  })
}

logout(){
  localStorage.clear();
  this.router.navigate(['login']);
}
}
