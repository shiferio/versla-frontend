import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {ModalRegistrationComponent} from './modal-registration/modal-registration.component';
import {MessageComponent} from './message/message.component';
import {RestApiService} from './rest-api.service';
import {DataService} from './data.service';
import {LoginPopupService} from './login-popup.service';
import {AuthGuardService} from './auth-guard.service';
import {ModalLoginComponent} from './modal-login/modal-login.component';
import {ProfileComponent} from './profile/profile.component';
import {SettingsComponent} from './settings/settings.component';
import {OrdersComponent} from './orders/orders.component';
import {AddressComponent} from './address/address.component';
import {SecurityComponent} from './security/security.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModalRegistrationComponent,
    MessageComponent,
    ModalLoginComponent,
    ProfileComponent,
    SettingsComponent,
    OrdersComponent,
    AddressComponent,
    SecurityComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, NgbModule.forRoot(),
    FormsModule,
    HttpClientModule
  ],
  providers: [
    RestApiService, DataService, LoginPopupService, AuthGuardService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalLoginComponent, ModalRegistrationComponent]
})
export class AppModule {}