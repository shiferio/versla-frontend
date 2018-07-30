import { Component, OnInit } from '@angular/core';
import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders = [];

  purchaseOrders = [];

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private spinner: NgxSpinnerService
  ) { }

  async ngOnInit() {
    this.spinner.show();
    await this.fetchOrdersInfo();
    this.spinner.hide();
  }

  async fetchOrdersInfo() {
    // good orders
    const respGoods = await this.rest.getOrders();
    const orders = respGoods['data']['orders'];
    this.orders = orders.filter(_order => _order.good);

    // purchase orders
    const respPurchases = await this.rest.getPurchaseOrders();
    const purchases = respPurchases['data']['purchases'];
    this.purchaseOrders = purchases
      .map(purchase => {
        const index = purchase['participants']
          .findIndex(participant => participant['user'] === this.data.user['_id']);
        const orderInfo = purchase['participants'][index];
        return {
          purchase: purchase,
          volume: orderInfo['volume'],
          paid: orderInfo['paid'],
          price: purchase['price_per_unit'],
          unit: purchase['measurement_unit']['name']
        };
      });
  }

}
