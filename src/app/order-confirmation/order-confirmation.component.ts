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

  async confirmCredentials() {
    try {
      const resp = await this.rest.addOrders({
        orders: this.cart.cart.map(good => ({
          store_id: good.store_id,
          good_id: good.good_id,
          quantity: good.quantity,
          values: good.values,
          price: good.price
        }))
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast(resp['meta'].message, '', 'success');

        await this.cart.clearCart();

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
