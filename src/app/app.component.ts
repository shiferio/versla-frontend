import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {ModalLoginComponent} from './modals/modal-login/modal-login.component';
import {ModalRegistrationComponent} from './modals/modal-registration/modal-registration.component';

import {DataService} from './data.service';

@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.scss']})
export class AppComponent implements OnInit {
  title = 'app';

  goods_count = 0;

  cart_sub: any;

  constructor(private modalService: NgbModal, private router: Router, private data: DataService) {

  }

  async ngOnInit() {
    await this
      .data
      .getProfile();

    await this.updateGoodsCount();
    this.cart_sub = this
      .data
      .onCartChanged
      .subscribe(async (info) => {
      this.goods_count = info.cartSize;
    });
  }

  async updateGoodsCount() {
    this.goods_count = (await this.data.getCart()).length;
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

}
