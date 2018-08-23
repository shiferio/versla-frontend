import { Component, OnInit } from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {DataService} from '../data.service';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-stores-list',
  templateUrl: './stores-list.component.html',
  styleUrls: ['./stores-list.component.scss']
})
export class StoresListComponent implements OnInit {

  stores = [];

  noResults = true;

  constructor(
    private rest: RestApiService,
    private data: DataService,
    private router: Router
  ) { }

  async loadAllStores() {
    try {
      const resp = await this.rest.getAllStores();

      this.stores = resp['data']['stores'];
      if (resp['data']['stores'].length !== 0) {
        this.noResults = false;
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

  async ngOnInit() {
    await this.loadAllStores();
    this
      .router
      .events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (event.url.includes('stores')) {
            this.data.setTitle('Магазины');
          }
        }
      });
  }
}
