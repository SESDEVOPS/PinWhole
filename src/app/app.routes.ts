import { Routes } from '@angular/router';
import { OrderItemsComponent } from './order-items/order-items.component';
import { PendingOrderComponent } from './pending-order/pending-order.component';
import { ArchiveOrderComponent } from './archive-order/archive-order.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './Guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { WalletComponent } from './wallet/wallet.component';
import { TransactionService } from './Services/transaction.service';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    
    //canActivate: [authGuard],
    children: [
      { path: 'new', component: OrderItemsComponent, 
     //  canActivate: [authGuard] 
      },
      {
        path: 'pending',
        component: PendingOrderComponent,
       //  canActivate: [authGuard],
      },
      {
        path: 'archive',
        component: ArchiveOrderComponent,
     //   canActivate: [authGuard],
      },
      {
        path: 'history',
        component: OrderHistoryComponent,
         // canActivate: [authGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
       //  canActivate: [authGuard],
      },
      {
        path: 'wallet',
        component: WalletComponent,
       //  canActivate: [authGuard],
      },
      // {
      //   path: 'transaction',
      //   component: TransactionService,
      //  //  canActivate: [authGuard],
      // },
    ],
  },

  // { path: 'profile', component: BusinessprofileComponent },
  // { path: '',
  //     redirectTo: 'profile',
  //     pathMatch: 'full'}
];
