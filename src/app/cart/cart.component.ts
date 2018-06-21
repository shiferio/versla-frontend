import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {RestApiService} from '../rest-api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cart = [];

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    await this.getCartInfo();
  }

  async getCartInfo() {
    await this.data.getProfile();
    this.cart = [];

    if (this.data.user.cart) {
      for (const good of this.data.user.cart) {
        const good_info = (await this.rest.getGoodById(good.good_id))['data']['good'];
        Object.assign(good_info, {quantity: good.quantity});
        this.cart.push(good_info);
      }
    }
  }

  get summary(): number {
    return this
      .cart
      .map(good => good.price * good.quantity)
      .reduce((acc, cur) => acc + cur, 0);
  }

  get delivery(): number {
    return 100;
  }

  async deleteGood(good_id: number) {
    await this.data.deleteGoodFromCart(good_id);
    await this.getCartInfo();

    this
      .data
      .addToast(
        'Ура!', '', 'success'
      );
  }

}
