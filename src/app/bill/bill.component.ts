import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from '../Services/helperService';
import { ItemService } from '../Services/itemservice';
import { UserService } from '../Services/user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-bill',
  standalone: true,
  imports: [],
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent implements OnInit {
  status:any="";
orderId:any;
orderDate:any;
userData:any;
userComapany:any="";
item:any;

order:any;
code:any;
region:any;
codeValues:any;
ELEMENT_DATA=[];
constructor(private http: HttpClient, private _route : ActivatedRoute,private router:Router,
  private helperservice: HelperService, private itemservice: ItemService,private userService: UserService
) {}
  async ngOnInit() {
   
    await this.GetUserDetails();
    await this.getOrder();
   // console.log(".userComapany",this.userComapany)
  }

  // getUser=async()=>
  //   {
  //     await this.userService.GetCurrenctUser()
  //       .then((user: any) => {    
  //         console.log(".user",user)
  //         if(user!=null){
  //         this.userData = user;
  //         this.userComapany=user.company
  //         console.log("this.userComapany",this.userComapany)
  //         }
  //       }); 
  //   }


    async GetUserDetails() {
      //console.log("this.userData",this.userData)
      await this.userService.GetCurrenctUser().then((data) => {
        if(data!= undefined)
        {
          this.userData = data;
          this.userComapany = data.company
        }
        
        //console.log("this.userData1",this.userData)
      });
    }

  getOrder=async()=>
    {
      
      this.orderId=this._route.snapshot.paramMap.get("id");
      this.orderDate=this._route.snapshot.paramMap.get("orderDate");
     await this.itemservice.getOrderById(this.orderId).then((order)=>
      {
        this.order=order;
    
      })

      console.log("order", this.order);
    }


    async downloadBill()
    {
     
      let DATA: any = document.getElementById('htmlData');
      html2canvas(DATA).then((canvas) => {
        let fileWidth = 180;
        var top_left_margin = 5;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', top_left_margin,top_left_margin, fileWidth, fileHeight);
        PDF.save('bill.pdf');
      });
    
    }
}
