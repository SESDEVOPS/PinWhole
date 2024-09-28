import { Component, OnInit } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ItemService } from '../Services/itemservice';
import { CommonModule } from '@angular/common';
import { HelperService } from '../Services/helperService';
import { DialogModule } from 'primeng/dialog';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { BadgeService } from '../badge-service.service';

@Component({
  selector: 'app-draft',
  standalone: true,
  imports: [
    FieldsetModule,
    FloatLabelModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    NgxPaginationModule
  ],
  templateUrl: './draft.component.html',
  styleUrl: './draft.component.css'
})
export class DraftComponent implements OnInit{

  selectAllChecked: boolean = false;
  isSelected = false;
  showTransactionInProcess = false;
  allOrders: any;
  archiveToBeOrder: any;
  filteredOrders: any;
  searchFilter: any;
  selectedOrderForArchive: any[] = [];
  showArchiveComplete = false;
  checkboxStates: { [orderID: number]: boolean } = {};
  selectedOrders: Set<number> = new Set<number>(); // To track selected orders
  eCodeValue: any;
  userData: any;
  page: number = 1; // Current page
  itemsPerPage: number = 5; // Items per page
  


  constructor(
    private router: Router,
    private itemservice: ItemService,
    private helperService: HelperService,
    private userService: UserService,
    private badgeService: BadgeService
  ) {}

  async GetUserDetails() {
    //console.log("this.userData",this.userData)
    await this.userService.GetCurrenctUser().then((data) => {
      this.userData = data;
   //  console.log("this.userData",this.userData)
    });
  }
  async ngOnInit() {
    await this.GetUserDetails();
    await this.getDraftOrders();

   
   
  }

  async getDraftOrders(){
    await this.itemservice.getClientDraftOrders("").then((data) => {
      if (data != null) {
       // console.log('History', data);
        this.allOrders = data;
        this.filteredOrders = data;
       // console.log('History', data);
       
        this.filteredOrders.forEach((object: any) => {
          this.checkboxStates[object.orderID] = false; // Initialize all checkboxes to false
        });

        //this.updatePaginatedOrders();
      }
    });
  }

  DeleteBill(orderId:string){
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
    var orderData: any;
    orderData = await this.filteredOrders.find((o:any)=>o.orderID==orderId)

    orderData.is_Deleted=true;
    let formData = new FormData();
    formData.append("text",JSON.stringify(orderData));
    this.itemservice.updateOrderStatus(formData).then(async ()=>
    {  
      var walletBadge=
      {
        value:1,
        op:"minus"
      }
     //this.badgeService.sendEventBadge(walletBadge);
    });

    await this.getDraftOrders();
  
  }

  openBill(orderId:string)
  {
   
    this.router.navigate(['/home/bill/' + orderId, {
      orderDate: ""
    }])

  }


}
