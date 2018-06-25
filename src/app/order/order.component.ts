import { Component, OnInit } from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {DataService} from '../data.service';
import {CartService} from '../cart.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalUnavailableGoodsComponent} from '../modals/modal-unavailable-goods/modal-unavailable-goods.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  constructor(
    public cart: CartService,
    private data: DataService,
    private rest: RestApiService,
    private modalService: NgbModal
  ) { }

  async ngOnInit() { }

  get summary(): number {
    return this
      .cart
      .cart
      .filter(good => good.is_available)
      .map(good => good.price * good.quantity)
      .reduce((acc, cur) => acc + cur, 0);
  }

  get delivery(): number {
    return 100;
  }

  async confirmOrder() {
    if (this.cart.cart.every(good => good.is_available)) {
      console.log('Order was confirmed');
    } else {
      this
        .modalService
        .open(ModalUnavailableGoodsComponent);
    }
  }

  async deleteGood(good_id: number) {
    await this.cart.deleteGoodFromCart(good_id);

    this
      .data
      .addToast(
        'Ура!', '', 'success'
      );
  }
}
