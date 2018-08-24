import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalLoginComponent} from './modals/modal-login/modal-login.component';
import {ModalRegistrationComponent} from './modals/modal-registration/modal-registration.component';

import {DataService} from './data.service';
import {CartService} from './cart.service';
import {SearchService} from './search.service';
import {RestApiService} from './rest-api.service';
import {Subscription} from 'rxjs';
import {ScopeModel, SearchFieldService} from './search-field.service';
import {ModalSendErrorComponent} from './modals/modal-send-error/modal-send-error.component';
import {ModalSendFeatureComponent} from './modals/modal-send-feature/modal-send-feature.component';
import {Title} from '@angular/platform-browser';
import {JointPurchaseSearchService} from './joint-purchase-search.service';
import {VerslaChatAdapter} from './chat-adapter';
import {ChatService} from './chat.service';
import {ModalCategoryChooserComponent} from './modals/modal-category-chooser/modal-category-chooser.component';

@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.scss']})
export class AppComponent implements OnInit, OnDestroy {

  title = 'app';

  public isCollapsed = true;

  goods_count = 0;

  cart_sub: Subscription;

  query_params_sub: Subscription;

  route_params_sub: Subscription;

  url = '';

  query = '';

  city_menu = false;

  categories = [];

  chatAdapter: any;

  categoryMenuCollapsed = true;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private data: DataService,
    private search: SearchService,
    private purchaseSearch: JointPurchaseSearchService,
    private rest: RestApiService,
    private cart: CartService,
    public searchField: SearchFieldService,
    private route: ActivatedRoute,
    private titleService: Title,
    private chatService: ChatService
  ) {
    this.chatAdapter = new VerslaChatAdapter(this.chatService, this.data);
  }

  async ngOnInit() {
    await this
      .data
      .getProfile();

    this.cart_sub = this
      .cart
      .onCartChanged
      .subscribe(async (info) => {
        this.goods_count = info.cartSize;
      });

    await this.cart.loadCart();

    const resp = await this.rest.getAllGoodCategories();
    this.categories = resp['data']['categories'];

    this.query_params_sub = this
      .route
      .queryParamMap
      .subscribe(params => {
        this.query = params.get('query') || '';
      });
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  ngOnDestroy() {
    this.cart_sub.unsubscribe();
    this.query_params_sub.unsubscribe();
  }

  openModalLogin() {
    const modalRef = this
      .modalService
      .open(ModalLoginComponent);

    modalRef
      .result
      .then(async () => {
        await this.data.refreshPage();
      })
      .catch(error => {
        console.log(error);
      });
  }

  openModalSendError() {
    const modalRef = this
      .modalService
      .open(ModalSendErrorComponent, { windowClass: 'modal-dialog-centered' });

    modalRef
      .result
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  openModalSendFeature() {
    const modalRef = this
      .modalService
      .open(ModalSendFeatureComponent);

    modalRef
      .result
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }


  async openModalRegistration() {
    const modalRef = this
      .modalService
      .open(ModalRegistrationComponent);

    modalRef
      .result
      .then(async () => {
        await this.openModalLogin();
      })
      .catch(error => {
        console.log(error);
      });
  }

  openModalCategoryChooser() {
    const modalRef = this
      .modalService
      .open(ModalCategoryChooserComponent);

    modalRef
      .result
      .then(async (category) => {
        if (category) {
          await this.openSearchByCategory(category);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  logout() {
    this.data.clearProfile();
    this
      .router
      .navigate(['']);
  }

  get token() {
    return localStorage.getItem('token');
  }

  get chatUserId() {
    return this.data.user._id;
  }

  get isLoggedIn() {
    return this.data.user;
  }

  get categoryTree() {
    return this.data.categoryTree;
  }

  async openSearch() {
    if (!this.router.url.startsWith('/search')) {
      this.searchField.activeScope.search.reset();
    }

    this.searchField.activeScope.search.query = this.query;
    this.searchField.activeScope.applyFilters();
    this.searchField.activeScope.search.navigate();
  }

  onSearchChange(value: string) {
    if (this.router.url.startsWith('/search')) {
      this.searchField.activeScope.search.query = value;
      this.searchField.activeScope.search.navigate();
    }
  }

  get availableCities(): Array<any> {
    return this.data.cities;
  }

  get preferredCity(): any {
    return this.data.getPreferredCity();
  }

  get availableScopes(): Array<ScopeModel> {
    return this.searchField.scopes;
  }

  toggleCityMenu() {
    this.city_menu = !this.city_menu;
  }

  hideCityMenu() {
    this.city_menu = false;
  }

  async selectCity(city: any) {
    this.hideCityMenu();

    await this.data.setPreferredCity(city);
  }

  async openSearchByCategory(category: any) {
    this.categoryMenuCollapsed = true;

    this.searchField.activeScope.search.reset();
    this.searchField.activeScope.search.category = { _id: category.id};
    this.searchField.activeScope.search.navigate();
  }
}
