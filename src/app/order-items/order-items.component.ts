import { Component, HostListener, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ItemService } from '../Services/itemservice';
import { OrderItem } from '../Models/item-model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { elementAt, map } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Region } from '../Models/region';
import { Currency } from '../Models/denomination';
import { FinalOrderToProcess, initialOrder } from '../Models/finalorder';
import { OrderItemComponent } from './order-item/order-item.component';
import { HelperService } from '../Services/helperService';

interface Order {
  region: string;
  currency: string;
  quantity: string;
  price: string;
  total: string;
}

@Component({
  selector: 'app-order-items',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    FloatLabelModule,
    CommonModule,
    HttpClientModule,
    ProgressSpinnerModule,
    OrderItemComponent,
    FormsModule,
  ],
  templateUrl: './order-items.component.html',
  styleUrl: './order-items.component.css',
  providers: [ItemService],
})
export class OrderItemsComponent implements OnInit {
  //orders: OrderItem[] = [];
  itemsForPurchase: any[] = [];
  filteredItems: any[] = [];
  loading = true;
  searchFilter: any;
  itemCountToFetch: any = 0;
  showMore = true;
  waitResponseFromDB = false;
  constructor(private itemService: ItemService, private helper: HelperService) {
    // this.onWindowScroll();
  }
  ngOnInit(): void {
    this.waitResponseFromDB = false;
    this.loading = true;
    this.getAllItems();
    this.loading = false;
  }

  async getAllItems() {
    await this.itemService.getAllItems().subscribe({
      next: (data: OrderItem[]) => {
        this.itemsForPurchase = data;
        this.filteredItems=data;
      },
      error: (c) => console.error('Error fetching products', c),
    });
  }

  async getMoreItems() {
    this.itemCountToFetch += 10;
    this.waitResponseFromDB = true;
    var items = {
      token: this.itemCountToFetch,
    };

    await this.itemService.getMoreItems(items).then((data) => {
      if (data != null) {
        console.log('data', data);
        this.itemsForPurchase.push(...data.allItems);
        this.filteredItems.push(...data.allItems)
        this.itemsForPurchase=this.filteredItems
        this.waitResponseFromDB=false

        //this.filterItemsForPurchase.push(...data.allItems);
        if (data.allItems.length == 0) this.showMore = false;
        // this.walletService.sendBallance(this.current_Balance);
      }
    });

    
   //this.filteredItems=this.removeDuplicates(this.filteredItems,"itemID")


    console.log('data', this.itemsForPurchase);
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let pos =
      (document.documentElement.scrollTop || document.body.scrollTop) +
      document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    var value = max - (max * 20) / 100;
    if (Math.round(pos) >= value) {
      if (this.waitResponseFromDB != true) {
        this.getMoreItems();
      }
    }
  }

  async searchItems() {
    // console.log('event', this.searchFilter);
    // this.itemsForPurchase = this.itemsForPurchase.filter(
    //   (c) => c.itemName == this.searchFilter
    // );

    // console.log('event', this.itemsForPurchase);
//debugger;
    if (this.searchFilter === '') {
      console.log("hehe")
      console.log("hehethis.itemsForPurchase",this.itemsForPurchase)
      this.filteredItems = this.itemsForPurchase;
    } else {
      this.applyFilterValueBtn();
    }

    //this.itemsForPurchase = this.filterItemsForPurchase;
  }

  async applyFilterValueBtn() {
    await this.itemService
      .getItemContainLettters(this.searchFilter)
      .then(async (data) => {
        console.log("data-data-nnn",data)
        if (data != null && data != undefined) {
          if (data.length != 0) {
            console.log("data-data",data)
            //this.checkSearch=true
            this.filteredItems = [];
            this.filteredItems.push(...data);
          }
        } else {
          this.filteredItems = [];
        }
      });
  }
  // showAll(){
  //   if(this.searchFilter != "")
  //     {
  //       this.getAllItems();
  //       this.filterItems();
  //     }
  //     else
  //     {
  //       this.getAllItems();
  //     }

  // }
}
