import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {DataService} from './data.service';
import {RestApiService} from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  onCartChanged = new Subject<any>();

  cart = [];

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) {
  }

  async saveCart() {
    const data = this.cart.map(good => ({
      good_id: good.good_id,
      quantity: good.quantity
    }));

    if (localStorage.getItem('token')) {
      await this
        .rest
        .updateCart({
          cart: data
        });
    } else {
      localStorage.setItem('cart', JSON.stringify({
        cart: data
      }));
    }

    this.onCartChanged.next({
      cartSize: this.cart.length
    });
  }

  async addGoodToCart(good_id: any, quantity: any) {
    quantity = Number.parseInt(quantity || 1);
    good_id = Number.parseInt(good_id);

    const index = this
      .cart
      .findIndex(good => good.good_id === good_id);
    if (index === -1) {
      this.cart.push({
        good_id: good_id,
        quantity: quantity
      });
    } else {
      this.cart[index].quantity += quantity;
    }

    await this.saveCart();
  }

  async deleteGoodFromCart(good_id: any) {
    good_id = Number.parseInt(good_id);

    const index = this.cart.findIndex(good => good.good_id === good_id);
    if (index !== -1) {
      this.cart.splice(index, 1);
      await this.saveCart();
    }
  }

  setGoodQuantity(good_id: any, quantity: any) {
    good_id = Number.parseInt(good_id);
    quantity = Number.parseInt(quantity);

    const index = this.cart.findIndex(good => good.good_id === good_id);
    if (index !== -1) {
      this.cart[index].quantity = quantity;
    }
  }

  private async fetchGoodData(cart: Array<any>) {
    const data = [];
    for (const good of cart) {
      const good_info = (await this.rest.getGoodById(good.good_id))['data']['good'];
      good_info.is_available = false;
      Object.assign(good_info, {
        quantity: good.quantity
      });
      data.push(good_info);
    }

    return data;
  }

  async loadCart() {
    let data: Array<any>;

    if (localStorage.getItem('token')) {
      await this
        .data
        .getProfile();

      data = this.data.user.cart;
    } else {
      const local = localStorage.getItem('cart');
      if (local) {
        data = JSON.parse(local);
      } else {
        data = [];
      }
    }

    this.cart = await this.fetchGoodData(data);

    this.onCartChanged.next({
      cartSize: this.cart.length
    });
  }
}
