import { Component, OnInit } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ItemService } from '../Services/itemservice';
import { CommonModule,DatePipe  } from '@angular/common';
import { TransactionService } from '../Services/transaction.service';
import { CalendarModule } from 'primeng/calendar';
import { HelperService } from '../Services/helperService';
//import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CalendarModule,FieldsetModule, FloatLabelModule, InputTextModule, CommonModule,FormsModule,ReactiveFormsModule,],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  providers: [DatePipe]
})
export class TransactionsComponent implements OnInit {
  testData: any;
  allTransactions: any;
  filteredOrders: any;
  searchFilter: any;
  fromDate: any | undefined;
  toDate: any | undefined;
  clientID: any = '';
  clientName: any = '';
  today = new Date();
  defaultdate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + this.today.getDate()).slice(-2);
  to: any = this.defaultdate;
  todays = new Date(this.today.getFullYear(), this.today.getMonth() - 1, 1) ;
from:any=this.todays.toISOString().slice(0, 10);
origTransactions: any;
  selectedDate: any;
 constructor(private transactionService: TransactionService,private datePipe: DatePipe, private helperService: HelperService) {

  this.today = new Date();
  this.defaultdate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + this.today.getDate()).slice(-2);
 }

  ngOnInit() {
    this.todays = new Date(this.today.getFullYear(), this.today.getMonth() - 1, 1) ;
    setTimeout(() => {
      this.from = new Date(this.today.getFullYear(), this.today.getMonth() - 1, 1); // August 30, 2024

    }, 1000);

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // Note: 0 for January, 11 for December
    const day = today.getDate();
    this.selectedDate = new Date(year, month, day);
    setTimeout(() => {
      this.to = this.selectedDate; //new Date(2024, 7, 30); // August 30, 2024
     }, 1000);


    this.testData =this.todays.toISOString().slice(0, 10);
    this.fromDate= this.todays.toISOString().slice(0, 10);
    this.toDate = this.defaultdate;
    this.clientID = localStorage.getItem('userID');
    this.clientName = localStorage.getItem('userName');
    this.transactionService.getClientTransactionLastMonths(this.clientID).then((data) => {
     // console.log("data",data.allTransactions);
      if (data != null) {
        this.allTransactions = data.allTransactions;
        this.origTransactions = data.allTransactions;

      }
    });
  }
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'MM-dd-yyyy')!;
  }
  async searchFilteredTransactions() {

    // console.log("this.From ", this.formatDate(this.from) )
    // console.log("this.TO ", this.formatDate(this.to) )

    if(this.from && this.to)
    {
      await this.transactionService.getClientTransactionPeriod(this.formatDate(this.from), this.formatDate(this.to),
      this.clientID).then(data => {
       // console.log("data",data)
        if (data != null) {
          this.allTransactions = data;
        }
      })
    }
    else{
      this.allTransactions = this.origTransactions;
    }
 }

 CalenderTouched(value: any)
 {
   if(!value)
   {
    this.allTransactions = this.origTransactions
   }
 }

 Export()
 {
  this.helperService.exportToExcel(this.origTransactions);
 }

}
