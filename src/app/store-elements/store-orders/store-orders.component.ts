import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';
import {ActivatedRoute, Route} from '@angular/router';

@Component({
  selector: 'app-store-orders',
  templateUrl: './store-orders.component.html',
  styleUrls: ['./store-orders.component.scss']
})
export class StoreOrdersComponent implements OnInit {

  orders = [];

  sub: any;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private route: ActivatedRoute
  ) { }

  async getStoreInfo(storeLink: string) {
    const storeInfo = await this.rest.getStoreByLink(storeLink);
    if (storeInfo['meta'].success) {
      const resp = await this.rest.getStoreOrders(storeInfo['data'].store._id);
      this.orders = resp['data']['orders'];
    }
  }

  async ngOnInit() {
    this.sub = this.route.params.subscribe(async (params) => {
      await this.getStoreInfo(params['link']);
    });
  }

  async updateOrderStatus(id: string) {
    try {
      await this.rest.updateOrderStatusDelivered(id);

      this
        .data
        .success('Информация обновлена');

      await this.getStoreInfo(this.route.snapshot.params['link']);
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }
}
