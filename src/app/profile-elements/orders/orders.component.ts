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
    await this.data.getProfile();
    const data = [];
    for (const order of this.data.user.orders) {
      const order_info = (await this.rest.getGoodById(order.good_id))['data']['good'];
      data.push({
        good_id: order.good_id,
        name: order_info.name,
        quantity: order.quantity,
        values: order.values
      });
    }

    this.orders = data;
  }

}
