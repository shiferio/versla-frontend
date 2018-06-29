import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router, ActivatedRoute} from '@angular/router';
import {ModalLoginComponent} from './modals/modal-login/modal-login.component';
import {ModalRegistrationComponent} from './modals/modal-registration/modal-registration.component';

import {DataService} from './data.service';
import {CartService} from './cart.service';
import {SearchService} from './search.service';

@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.scss']})
export class AppComponent implements OnInit {
  title = 'app';

  goods_count = 0;

  cart_sub: any;

  url = '';

  query = '';

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private data: DataService,
    private search: SearchService,
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
    localStorage.clear();
    this
      .router
      .navigate(['']);
  }

  get token() {
    return localStorage.getItem('token');
  }

  async openSearch() {
    await this.onSearchChange(this.query);
  }

  async onSearchChange(value: string) {
    if (this.router.url !== '/search') {
      await this
        .router
        .navigate(['search']);
    }

    this.search.onSearchChanged.next({
      name: value
    });
  }

}
