import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router, ActivatedRoute} from '@angular/router';
import {ModalLoginComponent} from './modals/modal-login/modal-login.component';
import {ModalRegistrationComponent} from './modals/modal-registration/modal-registration.component';

import {DataService} from './data.service';
import {CartService} from './cart.service';
import {SearchService} from './search.service';
import {RestApiService} from './rest-api.service';
import {Subscription} from 'rxjs';
import {SearchFieldService} from './search-field.service';
import {parse} from 'querystring';

@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.scss']})
export class AppComponent implements OnInit, OnDestroy {

  title = 'app';

  public isCollapsed = true;

  goods_count = 0;

  cart_sub: Subscription;

  route_sub: Subscription;

  url = '';

  query = '';

  city_menu = false;

  categories = [];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private data: DataService,
    private search: SearchService,
    private rest: RestApiService,
    private cart: CartService,
    private searchField: SearchFieldService,
    private route: ActivatedRoute
  ) {
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

    this.route_sub = this
      .route
      .queryParamMap
      .subscribe(params => {
        this.query = params.get('query') || '';
      });
  }

  ngOnDestroy() {
    this.cart_sub.unsubscribe();
    this.route_sub.unsubscribe();
  }

  openModalLogin() {
    const modalRef = this
      .modalService
      .open(ModalLoginComponent);

    modalRef
      .result
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  openModalRegistration() {
    const modalRef = this
      .modalService
      .open(ModalRegistrationComponent);

    modalRef
      .result
      .then(result => {
        console.log(result);
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

  async openSearch() {
    if (!this.router.url.startsWith('/search')) {
      this.search.reset();
    }

    this.search.query = this.query;
    this.search.navigate();
  }

  onSearchChange(value: string) {
    if (this.router.url.startsWith('/search')) {
      this.search.query = value;
      this.search.navigate();
    }
  }

  get availableCities(): Array<any> {
    return this.data.cities;
  }

  get preferredCity(): any {
    return this.data.getPreferredCity();
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
    this.search.reset();
    this.search.category = category;
    this.search.navigate();
  }
}
