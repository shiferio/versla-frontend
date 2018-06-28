import { Component, OnInit } from '@angular/core';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {CartService} from '../../cart.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalUnavailableGoodsComponent} from '../../modals/modal-unavailable-goods/modal-unavailable-goods.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  collapsed = {};

  constructor(
    public cart: CartService,
    private data: DataService,
    private rest: RestApiService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  async ngOnInit() {
    this.cart.cart.forEach(item => {
      this.collapsed[item._id] = true;
    });
  }

  get summary(): number {
    return this
      .cart
      .cart
      .filter(item => item.good.is_available)
      .map(item => item.good.price * item.quantity)
      .reduce((acc, cur) => acc + cur, 0);
  }

  get delivery(): number {
    return 100;
  }

  async confirmOrder() {
    if (this.cart.cart.every(item => item.good.is_available)) {
      await this
        .router
        .navigate(['/confirmation']);
    } else {
      this
        .modalService
        .open(ModalUnavailableGoodsComponent);
    }
  }

  async deleteItem(item_id: string) {
    await this.cart.deleteItemFromCart(item_id);

    this
      .data
      .addToast(
        'Ура!', '', 'success'
      );
  }
}
