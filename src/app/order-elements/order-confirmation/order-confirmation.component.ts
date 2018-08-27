import { Component, OnInit } from '@angular/core';
import {RestApiService} from '../../rest-api.service';
import {CartService} from '../../cart.service';
import {DataService} from '../../data.service';
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

  async ngOnInit() {
    await this.confirmCredentials();
  }

  async confirmCredentials() {
    try {
      const resp = await this.rest.addOrders({
        orders: this.cart.cart.map(item => ({
          store_id: item.good.store_id,
          good_id: item.good._id,
          price: item.good.price,
          quantity: item.quantity,
          values: item.values
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
