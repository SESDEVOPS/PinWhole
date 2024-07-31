import { Region } from '../app/Models/region';
import { HelperService } from '../app/Services/helperService';
import { Injector } from '@angular/core';
import { ItemService } from '../app/Services/itemservice';
import { OrderItemDetails } from '../app/Models/item-model';
import { Observable } from 'rxjs/internal/Observable';

export class CommonHelper {
  private helperservice: HelperService;
  private itemService: ItemService;
  constructor(private injector: Injector) {
    this.helperservice = this.injector.get(HelperService);
    this.itemService = this.injector.get(ItemService);
  }

  getRegionsAsPerId(regionId: number[]): any {
    this.helperservice.getRegions().subscribe({
      next: (data: Region[]) => {
        console.log('regionId', regionId);

        console.log('From Class B F', data);

        var newData = data.filter((item) => regionId.includes(item.regionID));
        // data.filter(c=>c.regionID in regionId);

        console.log('From Class A F', newData);
        return newData;
      },
      error: (c) => console.error('Error fetching regions', c),
    });
  }

 

  //  getItemDetails(itemID: number) {
  //    this.itemService.getItemDetails(itemID).subscribe({
  //     next: (data: OrderItemDetails[]) => {
  //     //  this.orderItemDetails = data;

  //     //var c = data.filter(c=>c.regionID)

  //     console.log("From Class itemDetails",data);

  //     const uniqueCategories = Array.from(new Set(data.map(item => item.regionID)));

  //       console.log(uniqueCategories); // Output: ['A', 'B', 'C']
  //       this.getRegionsAsPerId(uniqueCategories);

  //     },
  //     error: (c) => console.error('Error fetching regions', c),
  //   });
  // }
}
