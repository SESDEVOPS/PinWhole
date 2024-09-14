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
@Component({
  selector: 'app-order-history',
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
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent implements OnInit {
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

  downloadedOrder = 0;
  constructor(
    private router: Router,
    private itemservice: ItemService,
    private helperService: HelperService,
    private userService: UserService

  ) {}

  // eCode = new FormControl('', [
  //   Validators.required,
  // ]);

  SelectAllOrdersNew(event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.filteredOrders.forEach((order: any) =>
        this.selectedOrders.add(order.orderID)
      );
    } else {
      this.selectedOrders.clear();
    }
   // console.log('Selected Orders:', Array.from(this.selectedOrders));
  }

  SelectOrderNew(order: any, event: any) {
    if (event.target.checked) {
      this.selectedOrders.add(order.orderID);
    } else {
      this.selectedOrders.delete(order.orderID);
    }
    //console.log('Selected Orders:', Array.from(this.selectedOrders));
  }

  isChecked(order: any): boolean {
    return this.selectedOrders.has(order.orderID);
  }

  async ngOnInit() {
    await this.GetUserDetails();
    this.itemservice.clientAllOrders().then((data) => {
      if (data != null) {
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

  paginatedOrders: any[] = []; // Orders for the current page

  updatePaginatedOrders(): void {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);

   // console.log('paginatedOrders:', this.paginatedOrders);
  }

  

  async onPageChange(page: number) {
    this.page = page;
    await this.updatePaginatedOrders();
  }

  onSelectAllChange(isChecked: boolean) {
    this.selectAllChecked = isChecked;

   //// console.log('Select All:', isChecked);
   //// console.log('Checkbox States:', this.checkboxStates);
  }

  openBill(orderId: string, date: any) {
   
  
    this.router.navigate(['/home/bill/' + orderId, {
      orderDate: date
    }])
  }

  showSearchClear = false;
  async searchItems() {
   //// console.log('this.searchFilter ', this.searchFilter);
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

  SelectOrder(order: any, event: any) {
    //console.log("isChecked",event.target.checked);
    if (event.target.checked) {
      this.selectedOrderForArchive.push(order);
    } else {
      this.selectedOrderForArchive = this.selectedOrderForArchive.filter(
        (obj) => obj.billNumber !== order.billNumber
      );
    }

    //console.log("selectedOrderForArchive",this.selectedOrderForArchive);
  }

  SelectAllOrders(event: any) {
    if (event.target.checked) {
      this.isSelected = true;
      this.allOrders.forEach((element: any) => {
        this.selectedOrderForArchive.push(element);
      });
      //this.selectedOrderForArchive.push(this.allOrders);
      //this.selectedOrderForArchive = this.selectedOrderForArchive[0];
    } else {
      this.isSelected = false;
      this.selectedOrderForArchive = [];
      //this.selectedOrderForArchive.splice(this.allOrders);
    }

    //// console.log("selectedOrderForArchive",this.selectedOrderForArchive);
  }

  async ArchiveOrder() {
    this.showTransactionInProcess = true;
    //console.log('this.selectedOrderForArchive', this.selectedOrders);
   //// console.log('Size', this.selectedOrders.size);
    if (this.selectedOrders.size > 0) {
      var sID = 0;
      await this.helperService.getStatusByName('archive').then((data) => {
       // console.log('data.statusID', data.statusID);
        sID = data.statusID;
      });

      this.selectedOrders.forEach(async (orderId: any) => {
        await this.itemservice
          .getOrderById(orderId)
          .then((order) => (this.archiveToBeOrder = order));
        let formData = new FormData();
        this.archiveToBeOrder.statusID = sID;
        formData.append('text', JSON.stringify(this.archiveToBeOrder));
       
        this.itemservice
          .updateOrderStatus(formData)
          .then((data: any) => {
            //console.log("data",data)
            this.showArchiveComplete = true;
            this.showTransactionInProcess = false;
          });
      });
    }
    else{
      this.showTransactionInProcess = false;
    }
  }
  

  async GetUserDetails() {
    //console.log("this.userData",this.userData)
    await this.userService.GetCurrenctUser().then((data) => {
      this.userData = data;
     // console.log("this.userData",this.userData)
    });
  }
  
  async viewHistoryOrder() {
    this.showArchiveComplete = false;
    await this.itemservice.clientAllOrders().then((data) => {
      if (data != null) {
        this.allOrders = data;
        this.filteredOrders = data;      
        this.allOrders.forEach((object: any) => {
          this.checkboxStates[object.orderID] = false; // Initialize all checkboxes to false
        });
      }
    });
  }
  emailedCode: any;
  showDownloadCodePopup = false
  async download(order: any){
    this.showCodeErr = false; 
    await this.GetUserDetails();
    this.showTransactionInProcess = true;
     this.eCodeValue = "";
      this.downloadedOrder = order.orderID
      var val=Math.floor(1000+Math.random()*9000);
     // console.log("val",val);

var Subject =" OTP - Order No. "+order.billNumber
var message=
"Dear Partner;;"+
"Your One Time Pin is : "+val.toString()+";"
+"Please enter the code in the specified page to download your order."
    //if(userData)
    //console.log("Message_Email" ,this.userData.email )

    this.helperService.send(this.userData.email,message,Subject).then((data)=>{
      this.emailedCode =val;
      this.showDownloadCodePopup = true;
      this.showTransactionInProcess = false;
    }
    
    );

  }
  showCodeErr = false;
  showErrorInFLDLPopup= false;
  async proceedToDownload(){
    this.showCodeErr = false;  
   //// console.log("code--", this.emailedCode)
   //console.log("code--", this.downloadedOrder)
    if(this.emailedCode == this.eCodeValue && this.downloadedOrder > 0)
    {
      var allOrderValues= await  this.helperService.GetOrderValues(this.downloadedOrder)
      .then(async (data) => {
          if(data.length == 0)
          {
            this.showErrorInFLDLPopup = true;
            this.showDownloadCodePopup = false;
            return
          }

          await  this.helperService.exportAsExcelFile(data, this.downloadedOrder.toString());
          this.showDownloadCodePopup = false;
      });     
     //// console.log("allOrderValues",allOrderValues)
    }
    else
    {
      this.showCodeErr = true;  
    }
  }

  closePopup(){
    this.showErrorInFLDLPopup = false;
  }
}
