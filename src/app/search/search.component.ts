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

  categories = [];

  filter = {};

  query = '';

  selected_category: any;

  default_category = {
    all: true,
    name: 'Все'
  };

  constructor(
    private search: SearchService,
    private rest: RestApiService,
    private data: DataService
  ) { }

  async ngOnInit() {
    this.search.onSearchChanged.subscribe(async (query) => {
      this.query = query;
      await this.loadSearchResults();
    });

    await this.loadCategories();

    this.filter = {};
    this.categories.splice(0, 0, this.default_category);
    this.selected_category = this.categories[0];
  }

  get noResults(): boolean {
    return this.goods.length === 0;
  }

  async loadSearchResults() {
    try {
      const resp = await this.rest.searchGoodsByAnyField(0, 6, this.query, this.filter);

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

  async loadCategories() {
    const resp = await this.rest.getAllGoodCategories();
    this.categories = resp['data']['categories'];
  }

  async filterByCategory() {
    if (this.selected_category) {
      if (this.selected_category['all']) {
        delete this.filter['category'];
      } else {
        this.filter['category'] = this.selected_category['_id'];
      }
    }

    await this.loadSearchResults();
  }
}
