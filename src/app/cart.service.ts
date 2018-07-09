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

  private isValuesEqual(values1: Array<any>, values2: Array<any>) {
    const cmp = (a, b) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    };

    values1 = values1.sort(cmp);
    values2 = values2.sort(cmp);

    if (values1.length !== values2.length) {
      return false;
    }

    for (let i = 0; i < values1.length; ++i) {
      if (values1[i].name !== values2[i].name ||
        values1[i].value !== values2[i].value
      ) {
        return false;
      }
    }

    return true;
  }

  async saveCart() {
    const data = this.cart.map(good => ({
      good_id: good.good_id,
      quantity: good.quantity,
      values: good.values
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

  async addItemToCart(good_id: string, quantity: number, values: Array<any>) {
    quantity = quantity || 1;

    const index = this
      .cart
      .findIndex(item => {
        return !!(item.good_id === good_id &&
          this.isValuesEqual(item.values, values));
      });
    if (index !== -1) {
      this.cart[index].quantity += quantity;
    } else {
      this.cart.push({
        good_id: good_id,
        quantity: quantity,
        values: values
      });
    }

    await this.saveCart();
  }

  async deleteItemFromCart(item_id: string) {
    const index = this.cart.findIndex(item => item._id === item_id);
    if (index !== -1) {
      this.cart.splice(index, 1);
      await this.saveCart();
    }
  }

  async setItemQuantity(item_id: string, quantity: any) {
    quantity = Number.parseInt(quantity);

    const index = this.cart.findIndex(item => item._id === item_id);
    if (index !== -1) {
      this.cart[index].quantity = quantity;
    }

    await this.saveCart();
  }

  async setItemParamValue(item_id: string, name: string, value: string) {
    const itemIndex = this.cart.findIndex(item => item._id === item_id);
    const paramIndex = this.cart[itemIndex].values.findIndex(v => v.name === name);
    this.cart[itemIndex].values[paramIndex].value = value;

    await this.saveCart();
  }

  private async fetchItemData(cart: Array<any>) {
    return await Promise.all(cart.map(async (good) => {
      const resp = await this.rest.getGoodInCart(good.good_id);
      const good_info = resp['data']['good'];

      const new_good = Object.assign({}, good);
      new_good.good = good_info;
      return new_good;
    }));
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

    this.cart = await this.fetchItemData(data);

    this.onCartChanged.next({
      cartSize: this.cart.length
    });
  }

  async clearCart() {
    this.cart = [];
    await this.saveCart();
  }
}
