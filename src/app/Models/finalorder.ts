export interface FinalOrderToProcess {
    itemID: number;
    itemName: string;   
    categoryID: number;
    qty: number;
    price: number;
    total: number;
   
  }

  export const initialOrder : FinalOrderToProcess = {
    itemID: 0,
    itemName: '',
    categoryID: 0,
    qty: 0,
    price: 0,
    total: 0,
   

}