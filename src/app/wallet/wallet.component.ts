import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommissionService } from '../Services/commission.service';
import { loadScript } from "@paypal/paypal-js";
import { Router } from '@angular/router';
import { WalletService } from '../Services/wallet.service';
import { BalanceService } from '../Services/balance.service';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { PaypalComponent } from '../paypal/paypal.component';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css',
  providers: [DialogService]
})
export class WalletComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef | undefined;

  errorMsg: any;
  commissionRatePaypal: any;
  commissionRateCard: any;
  newPriceWCommissionPaypal: any;
  newPriceWCommissionCard: any;
  //flags
  showMsg = false;
  hasRendered = false;

  currencys: any[] = [{ name: 'USD', insertedValue: 100 }];
  ballance: number = 0;
  clientID: string = "";
  client: any;
  wallet: any;
  user:any;
  
  balances=[{
    balance:0,
 
    clientID:localStorage.getItem('userID'),
    currencyName: "",
    currencySymbol:""
  }]; 
  ref: any;
  constructor(private commissionServices: CommissionService,
    private router: Router,
    private walletService: WalletService,
    private balanceService:BalanceService,
    private dialogService: DialogService
  ){
   
  }
  async ngOnInit() {
    this.clientID = localStorage.getItem('userID')?.toString() ?? '';
    this.saveChange(this.currencys[0].insertedValue);
    await this.getCommission()
    await this.GetClientBalance() 
  }

  saveChange(value: number) {
    //console.log("vl", value)
    this.currencys[0].insertedValue = +value;
    if (this.commissionRatePaypal != 0)
    {
      this.newPriceWCommissionPaypal =
      Number(value) + Number(value) * (this.commissionRatePaypal / 100);
    }
      
    if (this.commissionRateCard != 0)
    {
      //console.log("commissionRateCard1", value + value * (this.commissionRateCard / 100))
      this.newPriceWCommissionCard =
      Number(value) + Number(value) * (this.commissionRateCard / 100);
    }      
  }   
  async GetCommission_Rate_Paypal()
  {
    await this.commissionServices.getExchangeRate("Commission_Rate_Paypal").then((data)=>
    {
      if(data!=null)
      {
        
        this.commissionRatePaypal=data.rateValue
        if(data.rateValue!=0){
          this.newPriceWCommissionPaypal=(this.currencys[0].insertedValue+
            (this.currencys[0].insertedValue*(data.rateValue/ 100)))
          }
              }
    })
  }
  async GetCommission_Rate_Card()
  {
    await this.commissionServices.getExchangeRate("Commission_Rate_Card").then((data)=>
    {
      if(data!=null)
      {
        
        this.commissionRateCard=data.rateValue
        if(data.rateValue!=0){
          this.newPriceWCommissionCard=(this.currencys[0].insertedValue+
            (this.currencys[0].insertedValue*(data.rateValue/ 100)))
          }
      }
    })
  }
async getCommission()
{
await this.GetCommission_Rate_Paypal()
await this.GetCommission_Rate_Card()

}

async configurePayment(value:  any){

  this.showMsg=false;
  var purePrice=0
  if(this.commissionRatePaypal!=0)
  {
    purePrice=value.insertedValue

  }
  else
  {
    purePrice=value.insertedValue
  }
  if(this.commissionRateCard!=0)
  {
    purePrice=value.insertedValue
 

  }
  else
  {
    purePrice=value.insertedValue
  }
  if(value.insertedValue!=0&&value.insertedValue>=100&&value.insertedValue<1000&&value.name!=null){
   
    this.wallet=await this.balances.find((w:any)=>w.currencyName=="USD")
    this.showMsg=false;
    var availableBalance:any=0
    var symbol="$"
    if(this.wallet==undefined)
     availableBalance=0
     else
     {
     availableBalance=this.wallet.balance
     symbol=this.wallet.currencySymbol
     }

  this.ref = this.dialogService.open(PaypalComponent, 
    {
      data:{
        newBalance:purePrice,
        newBalancePayPal:this.newPriceWCommissionPaypal,
        newBalanceCard:this.newPriceWCommissionCard,
        currency:value.name,
        clientID:localStorage.getItem('userID'),
        clientName:this.user,
        wallet:availableBalance,
        currencySymbol:symbol,
        user:this.user
      }


  } );
}


}

async GetClientBalance()
  {
    //console.log("dathis.clientIDta",this.clientID)
    if(this.clientID==undefined)
    return;
    await this.balanceService.getBalanceById(this.clientID ).then(async (data:any)=>
    {
      console.log("data",data)
      if(data!=undefined){
      this.balances=data
      var usdBalance=await this.balances.find((b:any)=>b.currencyName=="USD")
      if(usdBalance!=undefined)
      this.walletService.sendBallance(usdBalance.balance);
      }
    })
  }

  viewAllTransactions()
  {
    //this.router.navigate(['transaction'])
  }

}