import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastyModule} from 'ngx-toasty';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {ModalRegistrationComponent} from './modals/modal-registration/modal-registration.component';
import {RestApiService} from './rest-api.service';
import {DataService} from './data.service';
import {LoginPopupService} from './login-popup.service';
import {AuthGuardService} from './auth-guard.service';
import {ModalLoginComponent} from './modals/modal-login/modal-login.component';
import {ProfileComponent} from './profile-elements/profile/profile.component';
import {SettingsComponent} from './profile-elements/settings/settings.component';
import {OrdersComponent} from './profile-elements/orders/orders.component';
import {AddressComponent} from './profile-elements/address/address.component';
import {SecurityComponent} from './profile-elements/security/security.component';
import {StoresComponent} from './profile-elements/stores/stores.component';
import {ModalAddStoreComponent} from './modals/modal-add-store/modal-add-store.component';
import {StoreStartComponent} from './store-elements/store-start/store-start.component';
import {StoreUpdateComponent} from './store-elements/store-update/store-update.component';
import {StoreComponent} from './store-elements/store/store.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TagInputModule} from 'ngx-chips';
import {LoadingModule} from 'ngx-loading';
import {AgmCoreModule} from '@agm/core';
import {Ng4GeoautocompleteModule} from 'ng4-geoautocomplete';
import {ModalAddGoodComponent} from './modals/modal-add-good/modal-add-good.component';
import {NgxMaskModule} from 'ngx-mask';
import {GoodComponent} from './good-elements/good/good.component';
import {FixedFloatPipe} from './pipes/fixed-float.pipe';
import {ModalDeleteGoodComponent} from './modals/modal-delete-good/modal-delete-good.component';
import {CartComponent} from './cart-elements/cart/cart.component';
import {NewCommentComponent} from './good-elements/new-comment/new-comment.component';
import {ModalAddParameterComponent} from './modals/modal-add-parameter/modal-add-parameter.component';
import {OrderComponent} from './order-elements/order/order.component';
import {IntegerCounterComponent} from './cart-elements/integer-counter/integer-counter.component';
import {ModalUnavailableGoodsComponent} from './modals/modal-unavailable-goods/modal-unavailable-goods.component';
import {ModalEditStoreCredentialsComponent} from './modals/modal-edit-store-credentials/modal-edit-store-credentials.component';
import {OrderConfirmationComponent} from './order-elements/order-confirmation/order-confirmation.component';
import {GoodCardComponent} from './good-elements/good-card/good-card.component';
import {GoodListComponent} from './good-elements/good-list/good-list.component';
import {ItemParamsComponent} from './cart-elements/item-params/item-params.component';
import {SearchComponent} from './search/search.component';
import { CityChooserComponent } from './city-chooser/city-chooser.component';
import {ClickOutsideModule} from 'ng-click-outside';
import { StoreCategoryChooserComponent } from './store-category-chooser/store-category-chooser.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModalRegistrationComponent,
    ModalLoginComponent,
    ProfileComponent,
    SettingsComponent,
    OrdersComponent,
    AddressComponent,
    SecurityComponent,
    StoresComponent,
    ModalAddStoreComponent,
    StoreStartComponent,
    StoreUpdateComponent,
    StoreComponent,
    ModalAddGoodComponent,
    GoodComponent,
    FixedFloatPipe,
    ModalDeleteGoodComponent,
    CartComponent,
    NewCommentComponent,
    ModalAddParameterComponent,
    OrderComponent,
    IntegerCounterComponent,
    ModalUnavailableGoodsComponent,
    OrderConfirmationComponent,
    GoodCardComponent,
    GoodListComponent,
    ItemParamsComponent,
    ModalEditStoreCredentialsComponent,
    SearchComponent,
    CityChooserComponent,
    StoreCategoryChooserComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, NgbModule.forRoot(), ToastyModule.forRoot(),
    FormsModule,
    HttpClientModule,
    TagInputModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    LoadingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBbRyQ6gCN8ua67jk2RoqWoZdKFi6juOpM'
    }),
    Ng4GeoautocompleteModule.forRoot(),
    NgxMaskModule.forRoot(),
    ClickOutsideModule
  ],
  providers: [
    RestApiService, DataService, LoginPopupService, AuthGuardService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalLoginComponent,
    ModalRegistrationComponent,
    ModalAddStoreComponent,
    ModalAddGoodComponent,
    ModalDeleteGoodComponent,
    ModalAddParameterComponent,
    ModalUnavailableGoodsComponent,
    ModalEditStoreCredentialsComponent
  ]
})
export class AppModule {
}
