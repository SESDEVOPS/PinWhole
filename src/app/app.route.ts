import { Routes } from '@angular/router';
// import { OrderItemsComponent } from './order-items/order-items.component';
// import { PendingOrderComponent } from './pending-order/pending-order.component';
// import { ArchiveOrderComponent } from './archive-order/archive-order.component';
// import { OrderHistoryComponent } from './order-history/order-history.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './Guards/auth.guard';
import { RegisterUserComponent } from './register-user/register-user.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';

export const appRoute: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterUserComponent },
  {
    path: 'forget',
    component: ForgetpasswordComponent,
    
  },
  { 
    path: 'home', 
    loadChildren: () => import('./app.routes').then(m => m.routes), 
    canActivate: [authGuard] 
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];