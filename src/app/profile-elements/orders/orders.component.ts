import { Component, OnInit } from '@angular/core';
import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders = [];

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    await this.fetchOrdersInfo();
  }

  async fetchOrdersInfo() {
    const resp = await this.rest.getOrders();
    const orders = resp['data']['orders'];
    const data = [];
    for (const order of orders.filter(_order => _order.good)) {
      data.push({
        good_id: order.good._id,
        name: order.good.name,
        quantity: order.quantity,
        values: order.values
      });
    }

    this.orders = data;
  }

}
