import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ModalRegistrationComponent} from './modals/modal-registration/modal-registration.component';
import {ProfileComponent} from './profile-elements/profile/profile.component';
import {AuthGuardService} from './auth-guard.service';
import {SettingsComponent} from './profile-elements/settings/settings.component';
import {ProfileRoutingModule} from './profile-routing/profile-routing.module';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }, {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
  }, {
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
