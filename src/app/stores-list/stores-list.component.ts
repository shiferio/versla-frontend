import { Component, OnInit } from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {DataService} from '../data.service';

@Component({
  selector: 'app-stores-list',
  templateUrl: './stores-list.component.html',
  styleUrls: ['./stores-list.component.scss']
})
export class StoresListComponent implements OnInit {
  stores = [];
  noResults = true;
  constructor(private rest: RestApiService,
              private data: DataService) { }

  async loadAllMarkets() {
    try {
      const resp = await this.rest.getAllStores();

      if (resp['meta'].success) {
        this.stores = resp['data']['stores'];
        if (resp['data']['stores'].length !== 0) {
          this.noResults = false;
        }
      } else {
        this
          .data
          .addToast('Ошибка', resp['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error['meta'].message, 'error');
    }
  }

  async ngOnInit() {
    await this.loadAllMarkets();
  }

}
