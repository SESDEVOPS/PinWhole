import { Component, OnInit } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ItemService } from '../Services/itemservice';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [FieldsetModule, FloatLabelModule, InputTextModule, CommonModule,FormsModule,ReactiveFormsModule,],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent implements OnInit {
  allOrders: any;
  filteredOrders: any;
  searchFilter: any;
  constructor(private itemservice: ItemService) {}

  ngOnInit() {
    this.itemservice.clientAllOrders().then((data) => {
      if (data != null) {
        this.allOrders = data;
        this.filteredOrders = data;
        //console.log("History",data)
      }
    });
  }

  async searchItems() {
 console.log("this.searchFilter ", this.searchFilter )
    if (this.searchFilter === '') {
      this.filteredOrders = this.allOrders;     
    } else {     
      this.filteredOrders = this.allOrders.filter((order:any)=>order.billNumber.includes(`#${this.searchFilter}`));
      
    }
 }
}
