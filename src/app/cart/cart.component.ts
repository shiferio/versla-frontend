import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {CartService} from '../cart.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  constructor(
    private data: DataService,
    private router: Router,
    public cart: CartService
  ) { }

  async ngOnInit() {
    await this.cart.loadCart();
  }

  get summary(): number {
    return this
      .cart
      .cart
      .filter(good => good.is_available)
      .map(good => good.price * good.quantity)
      .reduce((acc, cur) => acc + cur, 0);
  }

  async deleteGood(good_id: number) {
    await this.cart.deleteGoodFromCart(good_id);

    this
      .data
      .addToast(
        'Ура!', '', 'success'
      );
  }

  async onQuantityChange(event) {
    const {good_id, counter} = event;
    this.cart.setGoodQuantity(good_id, counter);
  }

  async createOrder() {
    await this.cart.saveCart();

    await this
      .router
      .navigate(['/order']);
  }
}
