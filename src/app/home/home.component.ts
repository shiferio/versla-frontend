import { Component, OnInit } from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {CartService} from '../cart.service';
import {DataService} from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  goods = [];

  constructor(
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    await this.loadGoods();
  }

  async loadGoods() {
    const resp = await this.rest.getAllGoods(1, 6);
    this.goods = resp['data']['goods'] || [];
  }

  async onGoodDeleted(good_info: any) {
    await this.loadGoods();
  }

}
