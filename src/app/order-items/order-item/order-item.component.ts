import {
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import { OrderItem, OrderItemDetails } from '../../Models/item-model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ItemService } from '../../Services/itemservice';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { elementAt, map } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Region } from '../../Models/region';
import { Currency } from '../../Models/denomination';
import { FinalOrderToProcess, initialOrder } from '../../Models/finalorder';
import { ChangeDetectionStrategy } from '@angular/core'; // import
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { clientService } from '../../Services/clientservice';
import { ClientOffer } from '../../Models/clientoffers';
import { HelperService } from '../../Services/helperService';
import { OrderToProceed } from '../../Models/ordertoprocess';
import { customvalidator } from '../../validators/customvalidator';
import { ClientBalanceDetails } from '../../Models/clientbalancedetails';
import { CodeDetails } from '../../Models/codedetails';
import { Supplier } from '../../Models/supplier';
import { SupplierService } from '../../Services/suplierservice';
import { Status } from '../../Models/status';
import { environment } from '../../../environments/environments';
import { AuthInterceptor } from '../../interceptors/auth.interceptor';
import { EzipinService } from '../../Services/ezipin.service';
import { ValueService } from '../../Services/value.service';
import { MintrouteService } from '../../Services/mintroute.service';
import { UserService } from '../../Services/user.service';
import { WalletService } from '../../Services/wallet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.css',
})
export class OrderItemComponent implements OnInit {
  @Input() item!: OrderItem;
  selectedOption: any = null;
  selRegion: any = null;
  selectedCurrency: any = null;
  clientID: any = '';
  isDropdownDisabled: boolean = true;
  orderToProceed: OrderToProceed = {
    applicationUserId: '',
    categoryID: '',
    codeID: '',
    codeOrderPrice: 0,
    itemID: 0,
    orderSupplierID: 0,
    quantity: 0,
    statusID: '',
    discount: '0',
  };

  // order: OrderToProceed = {
  //   applicationUserId: '',
  //   categoryID: '',
  //   codeID: '',
  //   codeOrderPrice: 0,
  //   itemID: 0,
  //   orderSupplierID: 0,
  //   quantity: 0,
  //   statusID: '',
  //   discount: '0',

  //   // clientID: '',
  //   // OrderDateTime: new Date(),
  //   // lastBillNumber: 0,
  //   // is_Deleted: false,
  //   // billNumber: 0,
  //   // statusID: 0,
  //   // itemOrdered: {
  //   //   itemID: 0,
  //   //   codeID: 0,
  //   //   quantity: 0,
  //   //   discount: 0,
  //   // },
  // };

  order: any = {
    // clientID: '',
    OrderDateTime: new Date(),
    lastBillNumber: 0,
    is_Deleted: false,
    billNumber: 0,
    statusID: 0,
    // itemOrdered: {
    //   itemID: 0,
    //   codeID: 0,
    //   quantity: 0,
    //   discount: 0,
    // },
  };

  regions: Region[] = [];
  



  clientOffers: ClientOffer[] = [];
  allCurrencies: Currency[] = [];
  selectedCurrencies: Currency[] = [];
  orderItemDetails: OrderItemDetails[] = [];
  clientBalanceDetails: ClientBalanceDetails[] = [];
  supplier: Supplier[] = [];
  statuses: Status[] = [];
  selectedSupplier: Supplier = {
    supplierName: '',
    supplierID: '0',
    is_Deleted: false,
    codes: '',
  };
  codeDetails: any;
  insufficeintBalance = false;
  selectedCode: number | undefined;
  clientOfferPercentage: number | undefined;
  selectedRegion = 0;
  selectedCodeTypeID = 0;
  discountedPrice = 0;
  showDiscountedPrice = false;
  showOrderPopup = false;
  orderSuccessfull = false;
  orderCreationError = false;
  generatedOrderID = 0;
  formGroupForOrder: FormGroup | any;
  finalOrderToProcess: FinalOrderToProcess = initialOrder;
  loadingProgress = false;
  showOrderToProceedDialog = false;
  showOrderCompleteDialog = false
  userData: any;
  region = new FormControl(this.selectedRegion, [
    Validators.required,
    customvalidator,
  ]);

  
  currency = new FormControl(this.selectedCurrency, [
    Validators.required,
    customvalidator,
  ]);

  quantity = new FormControl(this.finalOrderToProcess.qty, [
    Validators.required,
  ]);
  price = new FormControl(this.finalOrderToProcess.price, [
    Validators.required,
  ]);
  total = new FormControl(this.finalOrderToProcess.total, [
    Validators.required,
  ]);

  apiUrl = environment.apiUrl;

  constructor(
    private itemService: ItemService,
    private helperservice: HelperService,
    private clientService: clientService,
    private supplierService: SupplierService,
    private ezipinService: EzipinService,
    private mintrouteService: MintrouteService,
    private valueService: ValueService,
    private injector: Injector,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private walletService:WalletService,
    private router: Router,
  ) {
    this.initializeFormControl();
  }
  ngOnInit(): void {
    this.getRegions();
    this.getCurrencies();
    this.getClientOffers();
    this.getClientBalance();
    this.getAllSuppliers();
    this.getStatuses();
    this.GetUserDetails();
  }

  initializeFormControl() {
    this.clientID = localStorage.getItem('userID');
    this.formGroupForOrder = new FormGroup({
      region: this.region,
      currency: this.currency,
      quantity: this.quantity,
      price: this.price,
      total: this.total,
    });
  }

  async GetUserDetails() {
    await this.userService.GetCurrenctUser().then((data) => {
      this.userData = data;
      //console.log("this.userData",this.userData)
    });
  }

  async getItemDetails() {
    await this.itemService.getItemDetails(this.item.itemID).subscribe({
      next: (data: OrderItemDetails[]) => {
        this.orderItemDetails = data;
        const codeRegions = Array.from(
          new Set(data.map((item) => item.regionID))
        );
        const itemCode = Array.from(new Set(data.map((item) => item.codeID)));
        this.getRegionsForSelectedItem(codeRegions);
      },
      error: (c) => console.error('Error fetching regions', c),
    });
    this.finalOrderToProcess.itemID = this.item.itemID;
    this.finalOrderToProcess.categoryID = this.item.categoryID;
  }

  async getRegions() {

    this.regions = await this.helperservice.getRegions();
   // console.log("this.regions",this.regions)
    // await this.helperservice.getRegions().subscribe({
    //   next: (data: Region[]) => {
    //     this.regions = data;
    //   },
    //   error: (c) => console.error('Error fetching regions', c),
  //  });
  }

  async getStatuses() {
    await this.helperservice.getStatuses().subscribe({
      next: (data: Status[]) => {
        this.statuses = data;
      },
      error: (c) => console.error('Error fetching status', c),
    });
  }

  async getAllSuppliers() {
    this.supplier = await this.supplierService.getAllSuppliers();
    if(this.supplier == undefined || this.supplier == null)
    {
      console.error('Error fetching suppliers');
    }
    // await this.supplierService.getAllSuppliers().subscribe({

    //   next: (data: Supplier[]) => {
    //     this.supplier = data;
    //   },
    //   error: (c) => console.error('Error fetching suppliers', c),
    // });
  }

  getRegionsForSelectedItem(uniqueRegionsAsPerCode: number[]) {
    var uniqueRegions = this.regions.filter((item) =>
      uniqueRegionsAsPerCode.includes(item.regionID)
    );
    this.regions = uniqueRegions;
  }

  async getCurrencies() {
    var data = await this.helperservice.getCurrencies();
    this.allCurrencies = data;
    this.selectedCurrencies = data;

    // await this.helperservice.getCurrencies().subscribe({
    //   next: (data: Currency[]) => {
    //     this.allCurrencies = data;
    //     this.selectedCurrencies = data;
    //   },
    //   error: (c) => console.error('Error fetching currencies', c),
    // });
  }

  async getClientOffers() {
    this.clientOffers = await this.clientService.getClientOffers();
    // await this.clientService.getClientOffers().subscribe({
    //   next: (data: ClientOffer[]) => {
    //     this.clientOffers = data;
    //   },
    //   error: (c) => console.error('Error fetching currencies', c),
    // });
  }

  async getClientBalance() {
    this.clientBalanceDetails =await this.clientService.getClientBalance();

    // await this.clientService.getClientBalance().subscribe({
    //   next: (data: ClientBalanceDetails[]) => {
    //     this.clientBalanceDetails = data;
    //   },
    //   error: (c) => console.error('Error fetching balance', c),
    // });
  }

  async getCodeDetails() {
    this.codeDetails = await this.helperservice.getCodeDetails(
      this.selectedCode?.toString() ?? ''
    );

    // await this.helperservice
    //   .getCodeDetails(this.selectedCode?.toString() ?? '')
    //   .subscribe({
    //     next: (data: any) => {
    //       console.log('data', data);
    //       this.codeDetails = data;
    //     },
    //     error: (c) => console.error('Error fetching code details', c),
    //   });
  }

  getCurrenciesForSelectedItem(uniqueCurrenciesAsPerCode: number[]) {
    this.allCurrencies = this.selectedCurrencies;
    var uniqueCurrencies = this.allCurrencies.filter((item) =>
      uniqueCurrenciesAsPerCode.includes(+item.codeTypeID)
    );
    uniqueCurrencies.sort((a, b) => +a.codePrice - +b.codePrice);
    this.allCurrencies = uniqueCurrencies;
  }

  onSelectedRegionChanged(event: any) {
    
    var codeCurrencies: number[];
    this.selectedCode = undefined;
    this.selectedCurrency = null;
    this.selectedRegion = event.value.regionID;
    codeCurrencies = Array.from(
      new Set(
        this.orderItemDetails
          .filter((c) => c.regionID == event.value.regionID)
          .map((item) => item.codeTypeID)
      )
    );
    if (this.selectedCodeTypeID && this.selectedRegion) {
      this.selectedCode = this.orderItemDetails.find(
        (item) =>
          item.codeTypeID == this.selectedCodeTypeID &&
          item.regionID == this.selectedRegion
      )?.codeID;
    }
    this.getCurrenciesForSelectedItem(codeCurrencies);
  }

  onSelectedCurrencyChanged(event: any) {
    this.selectedCode = undefined;
    this.selectedCodeTypeID = event.value.codeTypeID;

    if (this.selectedCodeTypeID && this.selectedRegion) {
      this.selectedCode = this.orderItemDetails.find(
        (item) =>
          item.codeTypeID == this.selectedCodeTypeID &&
          item.regionID == this.selectedRegion
      )?.codeID;
    }

    if (this.selectedCode) {
      this.clientOfferPercentage = this.clientOffers.find(
        (item) => item.codeID == this.selectedCode
      )?.percentage;
    }

    this.finalOrderToProcess.price = event.value.codePrice;

    if (
      this.clientOfferPercentage != undefined &&
      this.clientOfferPercentage > 0
    ) {
      this.discountedPrice =
        this.finalOrderToProcess.price -
        (this.finalOrderToProcess.price * this.clientOfferPercentage) / 100;
        //console.log("discountedPrice",this.discountedPrice)
      this.showDiscountedPrice = true;
    } else {
      //console.log("discountedPrice",this.discountedPrice)
      //console.log("showDiscountedPrice",this.showDiscountedPrice)
      this.discountedPrice = this.finalOrderToProcess.price;
    }

    if (this.finalOrderToProcess.qty <= 1) {
      this.finalOrderToProcess.qty = 1;
    }
    this.finalOrderToProcess.total =
      this.finalOrderToProcess.qty * this.discountedPrice;

    this.getCodeDetails();
  }
  purchaseItem(event: OrderItem): void {
    this.initializeFormControl();
    this.loadingProgress = false;
    this.showOrderPopup = true;
    this.getItemDetails();
    this.resetOrder();
  }
  calculateTotalPrice() {
    if (this.finalOrderToProcess.qty <= 0) {
      this.formGroupForOrder.setErrors({ invalidValue: true });
    }
    this.finalOrderToProcess.total =
      this.finalOrderToProcess.qty * this.discountedPrice;
  }
  resetOrder() {
    this.finalOrderToProcess.itemID = 0;
    this.finalOrderToProcess.itemName = '';
    this.finalOrderToProcess.categoryID = 0;
    this.finalOrderToProcess.qty = 0;
    this.finalOrderToProcess.price = 0;
    this.finalOrderToProcess.total = 0;
    this.selectedOption = null;
    this.selRegion = null;
    this.selectedCurrency = null;
    this.discountedPrice = 0;
    this.selectedCode = undefined;
    this.selectedRegion = 0;
    this.selectedCodeTypeID = 0;
    this.showDiscountedPrice = false;
  }

  processedOrder: any;
  createdItem: any;
  async CreateItem() {
    this.loadingProgress = true;
    this.clientBalanceDetails.map((ele) => {
      this.insufficeintBalance =
        this.finalOrderToProcess.total > ele.balance ? true : false;
    });

    var supp = this.supplier.find(
      (b) => b.supplierID == this.codeDetails.supplierID
    );
    this.selectedSupplier.supplierID = supp?.supplierID?.toString() ?? '';
    this.selectedSupplier.codes = supp?.codes?.toString() ?? '';
    this.selectedSupplier.supplierName = supp?.supplierName?.toString() ?? '';

    var orderedqty = 0;
    var availableQty = -1;
    var ezpinAvaliblity = false;
    var mintrouteAvailability = false;
    //debugger;
    if (this.selectedSupplier.supplierName == 'Ezpin') {
      await this.supplierService
        .getIfCatalogAvaliable(
          this.codeDetails.ezpinSKU,
          this.finalOrderToProcess.qty,
          this.codeDetails.supplierPrice
        )
        .then((data) => {
          if (data != null) {
            ezpinAvaliblity = data.availability;
          }
        })
        .catch((error) => {
          console.error('Error fetching Ezpin details:', error);
        });
    } else if (this.selectedSupplier.supplierName == 'Mintroute') {
      await this.supplierService
        .checkStockExists(this.codeDetails.denomination_id)
        .then((data) => {
          if (data != null) {
            if (data.status == true) {
              mintrouteAvailability = true;
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching Mintroute details:', error);
        });
    } else {
      await this.helperservice
        .getAllNewCodeValueByCodeId(this.codeDetails.codeID)
        .then((data) => {
          if (data) {
            availableQty = data.length;
          } else availableQty = 0;
        })
        .catch((error) => {
          console.error('Error fetching Mintroute details:', error);
        });
    }

    this.order.applicationUserId = this.clientID; //'ba06d3c4-3199-4df2-abfe-efd2b7864e12';
    this.order.orderSupplierID = this.codeDetails.supplierID;
    this.order.itemID = this.finalOrderToProcess.itemID;
    this.order.codeOrderPrice = this.finalOrderToProcess.total;
    this.order.quantity = this.finalOrderToProcess.qty;
    this.order.codeID = this.selectedCode?.toString() ?? '';
    this.order.statusID = '1';
    this.order.categoryID = this.order.categoryID?.toString() ?? '';
    this.order.discount = this.clientOfferPercentage?.toString() ?? '';

    var drsfStatusID: string = '';
    var draftStatus = await this.statuses.find(
      (i: any) => i.statusName == 'draft'
    );
    if (draftStatus == undefined) {
      this.helperservice.getStatusByName('draft').then((s: any) => {
        drsfStatusID = s.statusID;
      });
    } else drsfStatusID = draftStatus.statusID;

    let formData = new FormData();
    if (
      (availableQty >= this.order.quantity &&
        this.selectedSupplier.supplierName == 'Stock') ||
      (this.codeDetails.ezpinSku != 0 &&
        ezpinAvaliblity &&
        this.selectedSupplier.supplierName == 'Ezpin') ||
      (mintrouteAvailability &&
        this.selectedSupplier.supplierName == 'Mintroute')
    ) {
      //onsole.log('formData_final1', formData);
      ////debugger;
      if (this.finalOrderToProcess.qty <= this.codeDetails.maxCodeCount) {
        ////debugger;

        this.order.statusID = drsfStatusID;

        this.order.categoryID = this.item.categoryID?.toString() ?? '';
        ////////////////////////
        formData.append('text', JSON.stringify(this.order));

        await this.helperservice
          .createItem(formData)
          .then(async (data: any) => {
            //console.log("datafromCreateItem",data);
            this.createdItem = data;
            this.processedOrder = data;
            var draftOrderCount: any = 0;
            var prependingOrderCount: any = 0;
            var prependingStatus = await this.statuses.find(
              (i: any) => i.statusName == 'prepending'
            );

            this.showOrderToProceedDialog = true;
            this.showOrderPopup = false;
            this.getCode();
            this.cdr.detectChanges();
          });
      }
    }
  }

  showErrMsg = false;
  errMsg = '';
  code: any;
  codeType: any;
  codeSymbol: any;
  codePrice: any;
  Price: any;
  getCode = async () => {
    //  //debugger;
    if (this.processedOrder != null) {
      if (this.processedOrder.code == undefined) {
        this.code = await this.helperservice.getCodeDetails(
          this.processedOrder?.codeID
        );
      }

      // this.code = this.processedOrder.code;

      if (this.code) {
        if (this.code.codeID == this.processedOrder.codeID)
          this.codePrice = this.code.price;
        //  //debugger;
        if (this.processedOrder.codeType == undefined) {
          this.codeType = await this.helperservice.getCodeTypeById(
            this.code.codeTypeID
          );
        } else {
          this.codeType = this.processedOrder.codeType;
        }
        this.Price = this.codePrice * this.processedOrder?.quantity;
        this.Price = this.helperservice.paymentFormater(this.Price);
        this.getOrderPriceDiscount();
        this.checkChangeRate();
        this.cdr.detectChanges();
      }
    }
  };

  getOrderPriceDiscount = async () => {
    //;
    if (this.processedOrder?.discount != 0) {
      this.Price =
        this.Price - (this.Price * this.processedOrder?.discount) / 100;
      this.Price = this.helperservice.paymentFormater(this.Price);
    }
  };

  attribute: any;
  symbol: any;
  balance: any;
  Ocurrency: any;
  balanceID: any;
  showBalanceComp: any = false;
  addedRate: any;
  async checkChangeRate() {
    // await setTimeout(() => {}, 20000)
    var currencyData = null;
    await this.helperservice
      .getBalanceByclientIdandCurrencyAsync(
        this.processedOrder.applicationUserId,
        this.codeType.codeCurrency
      )
      .then(async (data: any) => {
        currencyData = data;
        //;
        if (currencyData == null && this.codeType.codeCurrency == 'USD') {
          this.showErrMsg = true;
          this.errMsg =
            'No balance available for currency ' + this.codeType.codeCurrency;
        } else {
          if (this.codeType.codeCurrency == 'USD') {
            // this.clicked=false
            this.symbol = this.codeType.codeSymbol;
            this.balance = data.balance;
            this.Ocurrency = this.codeType.codeCurrency;
            this.balanceID = data.balanceID;
            if (data != null) {
              if (Number(currencyData.balance) < Number(this.Price)) {
                this.showErrMsg = true;
                this.errMsg = 'No available balance in your wallet.';
                this.showBalanceComp = true;
              }
            }
            this.cdr.detectChanges();
          } else {
            if (data != null) {
              if (Number(this.Price) <= Number(data.balance)) {
                //this.clicked=false

                this.balance = data.balance;
                this.symbol = this.codeType.codeSymbol;
                this.Ocurrency = this.codeType.codeCurrency;
                this.balanceID = data.balanceID;
              } else {
                await this.helperservice
                  .getExchangeRate('Exchange_Rate')
                  .then((data: any) => {
                    this.addedRate = data;
                  });
                await this.helperservice
                  .checkRate(this.codeType.codeCurrency, this.Price)
                  .then(async (data: any) => {
                    if (data.rates.status == 'true') {
                      await this.helperservice
                        .getBalanceByclientIdandCurrencyAsync(
                          this.processedOrder.applicationUserId,
                          'USD'
                        )
                        .then(async (USDData: any) => {
                          if (USDData != null) {
                            //this.clicked=false

                            const rates = data.rates.rates;
                            this.balance = USDData.balance;
                            this.balanceID = USDData.balanceID;
                            var newRate =
                              Number(rates) +
                              (Number(rates) *
                                Number(this.addedRate.rateValue)) /
                                100;

                            this.Price = Number(
                              (this.Price * newRate).toFixed(2)
                            );

                            // this.Price = Number((this.Price*(rates['USD']).toFixed(2)).toFixed(2))
                            this.symbol = '$';
                            this.Ocurrency = 'USD';

                            if (Number(USDData.balance) < Number(this.Price)) {
                              this.showErrMsg = true;
                              this.errMsg = 'Balance not enough.';
                            }
                          } else {
                            this.showErrMsg = true;
                            this.errMsg = 'Please add to USD wallet.';
                          }
                        });
                    } else {
                      this.showErrMsg = true;
                      this.errMsg =
                        'Please add to ' +
                        this.codeType.codeCurrency +
                        ' wallet.';
                    }
                  });
              }
            } //exchange rate
            else {
              await this.helperservice
                .getExchangeRate('Exchange_Rate')
                .then((data: any) => {
                  this.addedRate = data;
                });
              await this.helperservice
                .checkRate(this.codeType.codeCurrency, this.Price)
                .then(async (data: any) => {
                  if (data.rates.status == 'true') {
                    await this.helperservice
                      .getBalanceByclientIdandCurrencyAsync(
                        this.processedOrder.applicationUserId,
                        'USD'
                      )
                      .then(async (USDData: any) => {
                        if (USDData != null) {
                          //var rates = json.info.quote.Value;
                          //multiple in it
                          // this.clicked=false
                          const rates = data.rates.rates;
                          this.balance = USDData.balance;
                          this.balanceID = USDData.balanceID;
                          /////
                          var newRate =
                            Number(rates) +
                            (Number(rates) * Number(this.addedRate.rateValue)) /
                              100;
                          this.Price = Number(
                            (this.Price * newRate).toFixed(2)
                          );

                          /////
                          //      this.Price = Number((this.Price*(rates['USD']).toFixed(2)).toFixed(2))
                          this.symbol = '$';
                          this.Ocurrency = 'USD';
                          if (Number(USDData.balance) < Number(this.Price)) {
                            this.showErrMsg = true;
                            this.errMsg =
                              'No available balance in your wallet.';
                            this.showBalanceComp = true;
                          }
                        } else {
                          this.showErrMsg = true;
                          this.errMsg = 'Please add to your wallet.';
                        }
                      });
                  } else {
                    this.showErrMsg = true;
                    this.errMsg =
                      'Please add to ' +
                      this.codeType.codeCurrency +
                      ' wallet.';
                  }
                });
            }
            this.cdr.detectChanges();
          }
        }
      });
    this.cdr.detectChanges();
  }
  current_Balance: any;
  loadingProgressPD = false;
  async payOrder() {
    //console.log('pay Order');
    this.loadingProgressPD = true;
    ////debugger;
    var itemId = this.processedOrder.itemID;
    var codeId = this.processedOrder.codeID;

    var supplier: any;

    supplier = this.selectedSupplier;
    //debugger;
    if (supplier.supplierName != 'Stock') {
      if (this.balance == null) {
        await this.getCode();
        //await this.getAllInitialize();
      }

      if (this.Price <= Number(this.balance)) {
        this.showErrMsg = false;
        /////

        this.current_Balance = Number(this.balance - this.Price).toFixed(2);
        if (this.current_Balance == null) return;
        if (this.balanceID == null) return;
        if (this.processedOrder == null) return;
        var b: any = {
          applicationUserId: this.processedOrder.applicationUserId,
          balance: Number(this.current_Balance),
          currencyName: this.Ocurrency,
          balanceID: this.balanceID,
          currencySymbol: this.symbol,
        };
        if (this.Ocurrency != null) {
          //console.log('await this.checkIfSupplier(b) - 1');
          await this.checkIfSupplier(b); //////not here
        }
      } else {
        this.showErrMsg = true;
        this.errMsg = 'Your balance is not enough,thanks.';
        //this.dialogRef.close();  ///here
        // this.dialogRef.close({errMsg:this.errMsg});
      }
    } // stock
    else {
      var availableCodeValue =
        await this.helperservice.getAvailableCodeValueQuantity(codeId);
      if (
        availableCodeValue != 0 &&
        this.processedOrder.quantity <= availableCodeValue
      ) {
        if (this.balance == null) {
          await this.getCode();
          //await this.getAllInitialize();
        }
        if (this.Price <= Number(this.balance)) {
          this.showErrMsg = false;

          // miuns from wallet
          this.current_Balance = Number(this.balance - this.Price).toFixed(2);
          if (this.current_Balance == null) return;
          if (this.balanceID == null) return;
          if (this.order == null) return;
          var b: any = {
            applicationUserId: this.processedOrder.applicationUserId,
            balance: Number(this.current_Balance),
            currencyName: this.Ocurrency,
            balanceID: this.balanceID,
            currencySymbol: this.symbol,
          };
          if (this.Ocurrency != null) {
            await this.checkIfSupplier(b);
            //console.log('await this.checkIfSupplier(b) - 2 ');
          }
        } else {
          this.showErrMsg = true;
          this.errMsg = 'Your balance is not enough,thanks.';
        }
      } else {
        if (this.balance == null) {
          await this.getCode();
          // await this.getAllInitialize();
        }
        if (this.Price <= Number(this.balance)) {
          this.showErrMsg = false;

          // miuns from wallet
          this.current_Balance = Number(this.balance - this.Price).toFixed(2);
          if (this.current_Balance == null) return;
          if (this.balanceID == null) return;
          if (this.order == null) return;
          var b: any = {
            applicationUserId: this.order.applicationUserId,
            balance: Number(this.current_Balance),
            currencyName: this.Ocurrency,
            balanceID: this.balanceID,
            currencySymbol: this.symbol,
          };
          if (this.Ocurrency != null) {
            await this.savePendingOrder(b);
          }
        } else {
          this.showErrMsg = true;
          this.errMsg = 'Your balance is not enough,thanks.';
        }
      }
    }
    //this.showOrderToProceedDialog = false;
   //this.loadingProgressPD = false;
  }

  async savePendingOrder(b: any) {
    //debugger;
    var pendingStatus = await this.statuses.find(
      (i: any) => i.statusName == 'pending'
    );

    this.processedOrder.statusID = pendingStatus?.statusID?.toString() ?? '-1';
    this.processedOrder.codeOrderPrice = this.Price;
    this.processedOrder.orderCurrency = this.Ocurrency;
    let formData = new FormData();

    formData.append('text', JSON.stringify(this.order));
    formData.append('SupplierName', 'justCreated');

    await this.itemService.updateOrderStatus(formData).then(async (data) => {
      if (data != null) {
        //deduct wallet
        await this.helperservice.editBlance(b).then(() => {
          if (this.Ocurrency == 'USD') {
             this.walletService.sendBallance(this.current_Balance);
          }
        });
        var transaction = await this.helperservice.saveTransaction(
          this.processedOrder.applicationUserId,
          this.Price,
          this.currency,
          ' wallet',
          'Purchase',
          'admin',
          data.billNumber,
          this.userData?.email,
          data.orderDateTime
        );
        //97711779
        //console.log('transaction', transaction);
        //send admin mail
        // 9771 // this.sendAdminMail();
        
        //console.log("showOrderToProceedDialog1")
        this.showOrderToProceedDialog = false;
        this.showOrderCompleteDialog = true;
        this.loadingProgressPD = false;
        this.cdr.detectChanges();
      }
    });
  }

  async checkIfSupplier(b: any) {
    // //debugger;
    var supplier = this.selectedSupplier;
    var prependingStatus = await this.statuses.find(
      (i: any) => i.statusName == 'prepending'
    );
    if (prependingStatus != undefined) {
      if (
        this.processedOrder.orderSupplierID == supplier.supplierID &&
        supplier.supplierName == 'Ezpin' &&
        this.processedOrder.statusID != prependingStatus.statusID
      ) {
        let formData = new FormData();
        formData.append('text', JSON.stringify(this.processedOrder));
        if (this.Ocurrency != null) await this.createEzpinOrder(formData, b);
      } else if (
        this.processedOrder.orderSupplierID == supplier.supplierID &&
        supplier.supplierName == 'Mintroute' &&
        this.processedOrder.statusID != prependingStatus.statusID
      ) {
        let formData = new FormData();
        formData.append('text', JSON.stringify(this.processedOrder));
        if (this.currency != null)
          await this.createMintrouteOrder(
            this.code,
            supplier,
            this.createdItem.quantity,
            b
          );
      } else {
        if (this.currency != null) this.saveOrder(b);
      }
    }
  }

  async saveOrder(b: any) {
    let cache: any = [];
    //debugger;
    var draftStatus = await this.statuses.find(
      (i: any) => i.statusName == 'draft'
    );

    if (this.processedOrder.statusID == draftStatus?.statusID) {
      if (this.code != undefined) {
        this.processedOrder.codeOrderPrice = this.Price;
        this.processedOrder.orderCurrency = this.Ocurrency;

        let formData = new FormData();
        formData.append('text', JSON.stringify(this.createdItem));
        formData.append('SupplierName', 'justCreated');

        this.helperservice.updateOrder(formData).then(async (data: any) => {         
          if (data != null) {           
            this.code.orderedQuantity =
              this.code.orderedQuantity + this.order.quantity;
            var exists = this.code.quantity - this.code.orderedQuantity;
            this.helperservice.editCode(this.code);
            await this.helperservice.editBlance(b).then(() => {
              if (this.Ocurrency == 'USD') {
                this.walletService.sendBallance(this.current_Balance);
              }
            });
            var transaction = await this.helperservice.saveTransaction(
              this.processedOrder.applicationUserId,
              this.Price,
              this.Ocurrency,
              ' wallet',
              'Purchase',
              'admin',
              this.processedOrder.billNumber,
              this.userData?.email,
              this.processedOrder.orderDateTime
            );
            //console.log('data_transaction', transaction);
            var draftOrderCount: any = 0;
            var prependingOrderCount: any = 0;
            var prependingStatus = await this.statuses.find(
              (i: any) => i.statusName == 'prepending'
            );

            //console.log('Your order has been completed');
            //console.log("showOrderToProceedDialog2")
            this.showOrderToProceedDialog = false;
            this.showOrderCompleteDialog = true;
            this.loadingProgressPD = false;
            this.cdr.detectChanges();
            
          }
          // this.sendMail(data);

          //this.close();
          //  this.dialog.open(CompleteOrderComponent, {
          //     data: {
          //       message: 'Your order has been completed.',
          //       status: 'history',
          //     },
          //   });
          // }
          //});
        });
      }
    } else {
      var prependingStatus = await this.statuses.find(
        (i: any) => i.statusName == 'prepending'
      );
      var pendingStatus = await this.statuses.find(
        (i: any) => i.statusName == 'pending'
      );

      // var pendingStatus=await this.baseService.getStatusByName("pending")
      if (this.processedOrder.statusID == prependingStatus?.statusID) {
        this.processedOrder.statusID = pendingStatus?.statusID;
        //var code=await this.allCodes.find((i:any)=>i.codeID==this.order.codeID)

        //var code=await this.baseService.getCodeById(this.order.codeID)
        this.processedOrder.codeOrderPrice = this.Price;
        this.processedOrder.orderCurrency = this.Ocurrency;
      }
      var draftStatus = await this.statuses.find(
        (i: any) => i.statusName == 'draft'
      );

      //var draftStatus=await this.baseService.getStatusByName("draft")
      var drsfStatusID = draftStatus?.statusID;

      /*  const date = new Date(this.order.orderDateTime);
          var offset = new Date().getTimezoneOffset();
  
          var t=date.setMinutes(date.getMinutes() - offset);
          this.order.orderDateTime=new Date(t); */
      let formData = new FormData();
      //debugger;
      formData.append(
        'text',
        JSON.stringify(this.processedOrder, function (key, value) {
          if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
            }
            // Store value in our collection
            cache.push(value);
          }
          return value;
        })
      );
      formData.append('SupplierName', 'justCreated');
      await this.itemService.updateOrderStatus(formData).then(async (data) => {
        ///this is the new added one
        await this.helperservice.editBlance(b).then(() => {
          if (this.Ocurrency == 'USD') {
             this.walletService.sendBallance(this.current_Balance);
          }
        });
        var transaction = await this.helperservice.saveTransaction(
          this.processedOrder.applicationUserId,
          this.Price,
          this.Ocurrency,
          ' wallet',
          'Purchase',
          'admin',
          data.billNumber,
          this.userData?.email,
          data.orderDateTime
        );
        var draftOrderCount: any = 0;
        var prependingOrderCount: any = 0;
        var prependingStatus = await this.statuses.find(
          (i: any) => i.statusName == 'prepending'
        );

        ///send admin mail
        //this.sendAdminMail();
        //console.log('Your order has been completed');
        //console.log("showOrderToProceedDialog3")
        this.showOrderToProceedDialog = false;
        this.showOrderCompleteDialog = true;
        this.loadingProgressPD = false;
        this.cdr.detectChanges();
        //  this.close();
        //   this.dialog.open(CompleteOrderComponent, {
        //     data: {
        //       message: 'Your order is pending.',
        //       status: 'pending',
        //     },
        //   });
      });
    }
    //  this.not_paid=false;
  }

  async createEzpinOrder(formData: any, b: any) {
    this.ezipinService
      .getIfCatalogAvaliable(
        this.code.ezpinSKU,
        this.processedOrder.quantity,
        this.code.supplierPrice
      )
      .then((data) => {
        if (this.currency != null) {
          if (data != null) {
            console.log('getIfCatalogAvaliable', data);
            this.ezipinService.createOrder(formData).then(async (data) => {
              if (data != null) {
                console.log('ezipinService', data);
                this.processedOrder.codeOrderPrice = this.Price;
                this.processedOrder.orderCurrency = this.Ocurrency;
                this.processedOrder.ezpinReferenceCode = data.referenceCode;
                if (this.processedOrder.ezpinReferenceCode == null) {
                  this.savePendingOrder(b);
                }
                if (data.statusText != 'accept' && data.statusText != null) {
                  this.order.ezpinReferenceCode = data.referenceCode;
                  this.savePendingOrder(b);
                } else if (data.statusText == 'accept') {
                  ///////////////////
                  this.ezipinService
                    .getOrderCardInfo(data.referenceCode)
                    .then(async (cardData) => {
                      var values: any[] = [];
                      if (cardData.results.length != 0) {
                        //console.log('cardData', cardData);
                        //////////////////
                        for (var codeValue of cardData.results) {
                          values.push({
                            code: codeValue.card_number,
                            serial_Number: codeValue.pin_code,
                            status: 'ordered',
                            is_Deleted: false,
                            codeID: this.order.codeID,
                            orderID: this.order.orderID,
                            orderDateTime: this.order.orderDateTime,
                          });
                        }
                        await this.valueService.addCodeValue(values);
                        this.processedOrder.codeValues = values;
                        this.processedOrder.ezpinShareLink =
                          await data.shareLink;
                        this.processedOrder.ezpinReferenceCode =
                          data.referenceCode;
                        //console.log('Before Save Order');
                        this.saveOrder(b);
                      }
                    });
                  /////////////////
                } else {
                  this.order.ezpinError = data.details;

                  this.savePendingOrder(b);
                }
              }
            });
          } else {
            this.order.ezpinError = data.details;

            this.savePendingOrder(b);
          }
        }
      });
  }
  // function stringify(obj) {
  //   let cache = [];
  //   let str = JSON.stringify(obj, function(key, value) {
  //     if (typeof value === "object" && value !== null) {
  //       if (cache.indexOf(value) !== -1) {
  //         // Circular reference found, discard key
  //         return;
  //       }
  //       // Store value in our collection
  //       cache.push(value);
  //     }
  //     return value;
  //   });
  //   cache = null; // reset the cache
  //   return str;
  // }

  async createMintrouteOrder(code: any, supplier: any, orderQty: any, b: any) {
    //debugger;
    await this.mintrouteService
      .checkStockExists(code.denomination_id)
      .then((data) => {
        if (data != null) {
          if (data.status == true) {
            if (orderQty == 1) {
              this.mintrouteService
                .addOrder(code.denomination_id)
                .then(async (orderResult) => {
                  if (orderResult != null) {
                    if (orderResult.status == true) {
                      this.createdItem.codeValues = [];
                      this.createdItem.codeValues.push({
                        code: orderResult.data.voucher.pin_code,
                        serial_Number: orderResult.data.voucher.serial_number,
                        is_Deleted: false,
                        status: 'ordered',
                        codeID: this.createdItem.codeID,
                        orderID: this.createdItem.orderID,
                        orderDateTime: this.createdItem.orderDateTime,
                      });

                     //console.log('min-order', this.createdItem.codeValues);

                      await this.valueService.addCodeValue(
                        this.createdItem.codeValues
                      );
                      this.saveOrder(b);
                    } else {
                      this.createdItem.mintrouteError = orderResult.error;

                      this.savePendingOrder(b);
                    }
                  } else {
                    this.savePendingOrder(b);
                  }
                });
            } else {
              this.mintrouteService
                .addBulkOrder(code.bulk_denomination_id, orderQty)
                .then(async (orderResult) => {
                  if (orderResult != null) {
                    if (orderResult.status == true) {
                      this.order.mintrouteBulkStatus = orderResult.status;
                      this.order.mintrouteBulkOrderID = orderResult.orderId;
                      this.savePendingOrder(b);
                    } // case error happen or status false
                    else {
                      this.order.mintrouteError = orderResult.error;
                      this.order.mintrouteBulkStatus = orderResult.status;

                      this.savePendingOrder(b);
                    }
                  } else {
                    this.savePendingOrder(b);
                  }
                });
            }
          } else {
            this.order.mintrouteError = data.error;

            this.savePendingOrder(b);
          }
        } else {
          this.savePendingOrder(b);
        }
      });
  }
  viewOrder()
  {
    this.router.navigate(['/home/history']);
  }

  continueShopping()
  {
    this.showOrderCompleteDialog = false;
    this.resetOrder();
  }
  hideConfirmPopup()
  {
    this.showOrderToProceedDialog = false
  }
  
}
