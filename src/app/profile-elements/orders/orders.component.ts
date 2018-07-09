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
    const resp = await this.rest.getOrders();
    const orders = resp['data']['orders'];
    this.orders = orders.filter(_order => _order.good);
  }

}
