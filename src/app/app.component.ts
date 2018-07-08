import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router, ActivatedRoute} from '@angular/router';
import {ModalLoginComponent} from './modals/modal-login/modal-login.component';
import {ModalRegistrationComponent} from './modals/modal-registration/modal-registration.component';

import {DataService} from './data.service';
import {CartService} from './cart.service';
import {SearchService} from './search.service';
import {RestApiService} from './rest-api.service';

@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.scss']})
export class AppComponent implements OnInit {
  title = 'app';
  public isCollapsed = true;
  goods_count = 0;

  cart_sub: any;

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
    private cart: CartService) {
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
    if (this.router.url !== '/search') {
      this.search.reset();
      await this
        .router
        .navigate(['search']);
    }

    this.onSearchChange(this.query);
  }

  onSearchChange(value: string) {
    if (this.router.url.startsWith('/search')) {
      this.search.query = value;
      this.search.invoke(0);
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
    if (this.router.url !== '/search') {
      this.search.reset();
      await this
        .router
        .navigate(['search']);
    }

    this.search.category = category;
    this.onSearchChange('');
  }
}
