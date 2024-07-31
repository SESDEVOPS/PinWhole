export interface OrderItem {
  itemID: number;
  itemName: string;
  image: string;
  description: string;
  categoryID: number;
  ezpinSku: number;
  mintroute_Category_Id: number;
}

export interface OrderItemDetails {
  codeID: number;
  price: number;
  supplierPrice: number;
  denomination_id: string;
  ezpinSKU: number;
  mintroute_Category_Id: string;
  mintroute_Brand_Id: string;
  quantity: number;
  offers: string;
  orderedQuantity: number;
  regionID: number;
  codeTypeID: number;
  supplierID: number;
  itemID: number;
}
