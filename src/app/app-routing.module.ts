import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile-elements/profile/profile.component';
import {AuthGuardService} from './auth-guard.service';
import {ProfileRoutingModule} from './profile-routing/profile-routing.module';
import {StoreComponent} from './store-elements/store/store.component';
import {GoodComponent} from './good-elements/good/good.component';
import {CartComponent} from './cart-elements/cart/cart.component';
import {OrderComponent} from './order-elements/order/order.component';
import {OrderConfirmationComponent} from './order-elements/order-confirmation/order-confirmation.component';
import {SearchComponent} from './search/search.component';
import { StoresListComponent} from './stores-list/stores-list.component';
import {JointPurchaseSearchComponent} from './joint-purchase-elements/joint-purchase-search/joint-purchase-search.component';
import {JointPurchaseComponent} from './joint-purchase-elements/joint-purchase/joint-purchase.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }, {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
  }, {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'stores',
    component: StoresListComponent
  },
  {
    path: 'order',
    component: OrderComponent
  },
  {
    path: 'confirmation',
    component: OrderConfirmationComponent
  },
  {
    path: 'store/:link',
    component: StoreComponent
  },
  {
    path: 'good/:good_id',
    component: GoodComponent
  },
  {
    path: 'search',
    children: [
      {
        path: '',
        component: SearchComponent
      },
      {
        path: 'purchase',
        component: JointPurchaseSearchComponent
      }
    ]
  },
  {
    path: 'purchase/:purchase_id',
    component: JointPurchaseComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ProfileRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
