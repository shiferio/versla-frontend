import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from '../profile/profile.component'
import {Routes, RouterModule} from '@angular/router';
import {OrdersComponent} from '../orders/orders.component';
import {SettingsComponent} from '../settings/settings.component';
import {SecurityComponent} from '../security/security.component';
import {AddressComponent} from '../address/address.component';

export const profileRoutes : Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      {
        path: '',
        component: OrdersComponent
      }, {
        path: 'orders',
        component: OrdersComponent
      }, {
        path: 'settings',
        pathMatch: 'full',
        component: SettingsComponent
      }, {
        path: 'security',
        pathMatch: 'full',
        component: SecurityComponent
      }, {
        path: 'address',
        pathMatch: 'full',
        component: AddressComponent
      }
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(profileRoutes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}