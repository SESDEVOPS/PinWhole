import { Component, OnInit } from '@angular/core';
import { Product } from '../Data/products';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { ItemService } from '../Services/itemservice';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-pending-order',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    RatingModule,
    CommonModule,
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    InputTextModule,
    CommonModule,FormsModule,ReactiveFormsModule,
  ],
  templateUrl: './pending-order.component.html',
  styleUrl: './pending-order.component.css',

})
export class PendingOrderComponent implements OnInit {
  pendingOrders: any;
  filteredOrders: any;
  searchFilter: any;
  constructor(private itemservice: ItemService) {}

  ngOnInit() {
    
    this.itemservice.clientPendingOrders().then((data)=>{
      if(data != null)
        { this.pendingOrders = data;
          this.filteredOrders = data;
         // console.log(data)
        }
      
    });
  }

  async searchItems() {
    console.log("this.searchFilter ", this.searchFilter )
       if (this.searchFilter === '') {
         this.filteredOrders = this.pendingOrders;     
       } else {     
         this.filteredOrders = this.pendingOrders.filter((order:any)=>order.billNumber.includes(`#${this.searchFilter}`));
         
       }
    }
 

 
}
