import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { SearchService } from '../search.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  goods = [];

  constructor(
    private search: SearchService,
    private rest: RestApiService,
    private data: DataService
  ) { }

  ngOnInit() {
    this.search.onSearchChanged.subscribe(async (query) => {
      await this.loadSearchResults(query);
    });
  }

  get noResults(): boolean {
    return this.goods.length === 0;
  }

  async loadSearchResults(query: any) {
    try {
      const resp = await this.rest.searchGoods(0, 6, query);

      if (resp['meta'].success) {
        this.goods = resp['data']['goods'];
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

}
