import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../Services/wallet.service';
import { BalanceService } from '../Services/balance.service';
import { loadScript } from '@paypal/paypal-js';
import { HelperService } from '../Services/helperService';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TransactionService } from '../Services/transaction.service';

@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [],
  templateUrl: './paypal.component.html',
  styleUrl: './paypal.component.css',
})
export class PaypalComponent {
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;
  data: any;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,   
    private router: Router,
    private walletService: WalletService,   
    private helperservice: HelperService,
    private balanceService: BalanceService,
    private transactionService: TransactionService
  ) {}

  showMsg = false;
  hasRendered = false;
  // params
  errorMsg: any;
  ballance: number = 0;
  clientID!: string;
  client: any;
  wallet: any;
  user: any;

  ngOnInit(): void {
    this.data = this.config.data;
    console.log('col', this.data);
    let myButton: any;
    if (myButton && myButton.close && this.hasRendered) {
      myButton.close();
      this.hasRendered = false;
    }
    loadScript({
      //test
      //"client-id": "AX1ZhYP-j5RpYxjDrj4NWbcIlncL6D05C6iEVE8levl6JUGTag8xKONLIkM5yNDIhRKtFBCYvLH5P34k",
      //live
      clientId:
        'AUE3a7O_iYgwMQQO7PkZI7okZb24pBvoruv0CvXLltmpDpjOtrtpEqMf-X0G0F9d0VarTtqPisMadTOh',

      currency: this.data.currency,
    }).then((paypal: any) => {
      myButton = paypal.Buttons({
        style: {},
        createOrder: (data: any, actions: any) => {
          var paidPrice = 0;
          if (data.paymentSource == 'card')
            paidPrice = this.data.newBalanceCard;
          if (data.paymentSource == 'paypal')
            paidPrice = this.data.newBalancePayPal;
          if (paidPrice != 0) {
            this.showMsg = false;
            var price = this.helperservice.paymentFormater(paidPrice);
            if (price != null && price != 0) {
              return actions.order.create({
                intent: 'CAPTURE',
                purchase_units: [
                  {
                    amount: {
                      value: price,
                      currency_code: this.data.currency,
                    },
                  },
                ],
              });
            }
          } else {
            this.showMsg = true;
            this.errorMsg = 'balance ranges from 0 to 1000.';
          }
        },
        onApprove: async (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            this.save();
          });
        },

        onCancel: async (data: any, actions: any) => {
          this.Cancel();
        },
        onError: async function (err: any) {
          this.showMsg = true;
          this.errorMsg = 'something wrong happened ';
        },
      });

      myButton
        .render(this.paypalElement.nativeElement)
        .then(() => {
          this.hasRendered = true;
        })
        .catch((err: any) => {
          myButton.close();
          this.ref.close();
          return;
        });
    });
  }
  save = async () => {
    var attribute: any;
    if (this.data.currency != null) {
      await this.balanceService
        .checkBlanaceByName(this.data.clientID, this.data.currency)
        .then(async (data: any) => {
          if (data == null) {
            //if null add new balace
            var balance = {
              ApplicationUserId: this.data.clientID,
              balance: Number(this.data.newBalance),
              currencyName: this.data.currency,
              currencySymbol: this.data.currencySymbol,
            };
            await this.balanceService.addBalance(balance).then(() => {
              if (this.data.currency == 'USD')
                //for updating the header user balance
                this.walletService.sendBallance(this.data.newBalance);
            });
          } // edit exist balance
          else {
            var b: any = {
              ApplicationUserId: this.data.clientID,
              balance: Number(this.data.wallet) + Number(this.data.newBalance),
              currencyName: this.data.currency,
              balanceID: data.balanceID,
              currencySymbol: this.data.currencySymbol,
            };
            await this.balanceService.editBlance(b).then(() => {
              if (this.data.currency == 'USD') {
                this.walletService.sendBallance(
                  Number(this.data.wallet) + Number(this.data.newBalance)
                );
              }
            });
          }
        });
      ////////////////////
      var transaction = {
        ApplicationUserId: this.data.clientID,
        TransactionMethod: this.data.currency + ' PayPal',
        TotalPrice: this.data.newBalance,
        TransactionType: 'Deposit',
        Beneficiary: this.data.clientID,
        ClientName: this.data.user,
        Currency: 'USD',
      };
       await this.transactionService.addTransaction(transaction).then((data) => {
        this.ref.close();
      this.router.navigate(['/home/new']);
      })
    }
  };
  //on cancel method
  Cancel = async () => {};
}
