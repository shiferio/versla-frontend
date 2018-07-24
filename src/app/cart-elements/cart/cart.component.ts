import { Component, OnInit } from '@angular/core';
import {DataService} from '../../data.service';
import {CartService} from '../../cart.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  collapsed = {};

  constructor(
    private data: DataService,
    private router: Router,
    public cart: CartService
  ) { }

  async ngOnInit() {
    await this.cart.loadCart();

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

  get cartIsEmpty(): boolean {
    return this.cart.cart.length === 0;
  }

  async deleteItem(item_id: string) {
    await this.cart.deleteItemFromCart(item_id);

    this
      .data
      .addToast(
        'Элемент успешно удалён!', '', 'success'
      );
  }

  async onQuantityChange(event) {
    const {item_id, counter} = event;
    await this.cart.setItemQuantity(item_id, counter);
  }

  async createOrder() {
    this
      .data
      .addToast(
        'Невозможно оформить заказ', 'Versla ещё официально не запущена', 'warning'
      );
    // if (!this.cartIsEmpty) {
    //   await this.cart.saveCart();
    //
    //   await this
    //     .router
    //     .navigate(['/order']);
    // } else {
    //   this
    //     .data
    //     .addToast('Упс', 'Корзина пуста', 'error');
    // }
  }
}
