import { Component, OnInit } from '@angular/core';
import { ItemService } from '../Services/itemservice';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelperService } from '../Services/helperService';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-archive-order',
  standalone: true,
  imports: [
    FieldsetModule,
    FloatLabelModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
  ],
  templateUrl: './archive-order.component.html',
  styleUrl: './archive-order.component.css',
})
export class ArchiveOrderComponent implements OnInit {
  allOrders: any;
  filteredOrders: any;
  searchFilter: any;
  showTransactionInProcess = false;
  showHistoryComplete = false;
  showDeleteComplete= false;
  constructor(
    private itemservice: ItemService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.viewArchiveOrder();
  }

  showSearchClear = false;
  async searchItems() {
    if (this.searchFilter === '') {
      this.filteredOrders = this.allOrders;
      this.showSearchClear = false;
    } else {
      this.filteredOrders = this.allOrders.filter((order: any) =>
        order.billNumber.includes(`#${this.searchFilter}`)
      );
      this.showSearchClear = true;
    }
  }

  clearSearchItems(){
    this.searchFilter = '';
    this.searchItems();
  }

  orderForHistory: any;
  async AddToHistory(orderId: any) {
     this.showTransactionInProcess = true;
    //console.log('this.selectedOrderForArchive', this.selectedOrders);
   // console.log('orderId', orderId);
    if (orderId > 0) {
      var sID = 0;
      await this.helperService.getStatusByName('history').then((data) => {
        //console.log('data.statusID', data.statusID);
        sID = data.statusID;
      });

      await this.itemservice
        .getOrderById(orderId)
        .then((order) => (this.orderForHistory = order));
      let formData = new FormData();
      this.orderForHistory.statusID = sID;
      formData.append('text', JSON.stringify(this.orderForHistory));

      this.itemservice.updateOrderStatus(formData).then((data: any) => {
        //console.log("data",data)
        this.showHistoryComplete = true;
        this.showTransactionInProcess = false;
      });

      
    }
  }

  viewArchiveOrder()
  {
    this.itemservice.clientAllArchiveOrders().then((data) => {
      if (data != null) {
        this.allOrders = data;
        this.filteredOrders = data;
        this.showHistoryComplete = false;
        this.showDeleteComplete = false;
        //console.log("History",data)
      }
    });
  }

  Delete(orderId: any){

    if(confirm("Are you sure, you want to delete ?"))
    {
      //console.log("Confirm Delete")
      this.ConfirmDelete(orderId);
    }
    else
    {
      //console.log("No Confirm Delete")
    }

  }
  async ConfirmDelete(orderId: any) {
    this.showTransactionInProcess = true;
   //console.log('this.selectedOrderForArchive', this.selectedOrders);
  // console.log('orderId', orderId);
   if (orderId > 0) {
    

     await this.itemservice
       .getOrderById(orderId)
       .then((order) => (this.orderForHistory = order));
     let formData = new FormData();
     this.orderForHistory.is_Deleted = true;
     formData.append('text', JSON.stringify(this.orderForHistory));

     this.helperService.updateOrder(formData).then((data: any) => {
       //console.log("data",data)
       this.showDeleteComplete = true;
       
       this.showTransactionInProcess = false;
     });

     
   }
 }

}
