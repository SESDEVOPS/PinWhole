import { Component, OnInit } from '@angular/core';
import { ItemService } from '../Services/itemservice';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-archive-order',
  standalone: true,
  imports: [FieldsetModule, FloatLabelModule, InputTextModule,  CommonModule,FormsModule,ReactiveFormsModule,],
  templateUrl: './archive-order.component.html',
  styleUrl: './archive-order.component.css'
})
export class ArchiveOrderComponent implements OnInit {
  allOrders: any;
  filteredOrders: any;
  searchFilter: any;
  constructor(private itemservice: ItemService) {}

  ngOnInit() {
    this.itemservice.clientAllArchiveOrders().then((data) => {
      if (data != null) {
        this.allOrders = data;
        this.filteredOrders = data;
        //console.log("History",data)
      }
    });
  }

  async searchItems() {   
       if (this.searchFilter === '') {
         this.filteredOrders = this.allOrders;     
       } else {     
         this.filteredOrders = this.allOrders
         .filter((order:any)=>order.billNumber
         .includes(`#${this.searchFilter}`));
         
       }
    }

}
