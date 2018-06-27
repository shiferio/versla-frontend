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
