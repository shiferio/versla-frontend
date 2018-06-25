import { Component, OnInit } from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {CartService} from '../cart.service';
import {DataService} from '../data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {

  constructor(
    private rest: RestApiService,
    private cart: CartService,
    private data: DataService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async buildOrders() {
    return this.cart.cart.map(good => ({
      good_id: good.good_id,
      quantity: good.quantity,
      values: good.values
    }));
  }

  async confirmCredentials() {
    const orders = this.data.user.orders;
    const new_orders = await this.buildOrders();
    for (const order of new_orders) {
      orders.push(order);
    }

    try {
      const resp = await this.rest.updateOrders({
        orders: orders
      });

      if (resp['meta'].success) {
        await this.cart.clearCart();
        console.log(resp);
        this
          .data
          .addToast(resp['meta'].message, '', 'success');

        await this
          .router
          .navigate(['/profile/orders']);
      } else {
        this
          .data
          .addToast(resp['meta'].message, '', 'error');
      }
    } catch (error) {
      this
        .data
        .addToast(error['message'], '', 'error');
    }
  }
}
