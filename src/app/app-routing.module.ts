import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile-elements/profile/profile.component';
import {AuthGuardService} from './auth-guard.service';
import {ProfileRoutingModule} from './profile-routing/profile-routing.module';
import {StoreComponent} from './store-elements/store/store.component';
import {GoodComponent} from './good/good.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }, {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
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
