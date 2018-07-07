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

  cities = [];

  selected_city: any;

  default_city = {
    all: true,
    name: 'Все'
  };

  rating = 0;

  page_size = 4;

  selected_page = 1;

  total = 0;

  constructor(
    private search: SearchService,
    private rest: RestApiService,
    private data: DataService
  ) { }

  async ngOnInit() {
    await this.loadCategories();
    await this.loadCities();

    this.resetSearch();

    this.search.onSearchChanged.subscribe(async (query) => {
      this.query = query;
      await this.loadSearchResults();
    });
  }

  resetSearch() {
    this.filter = {};

    this.categories.splice(0, 0, this.default_category);
    this.selected_category = this.categories[0];

    this.cities.splice(0, 0, this.default_city);
    const index = this.cities.findIndex(city => city['_id'] === this.data.getPreferredCity()['_id']);
    this.selected_city = this.cities[index];
    this.filter['city'] = this.selected_city['_id'];

    this.filter['rating'] = this.rating;
  }

  resetPagination() {
    this.selected_page = 1;
  }

  get noResults(): boolean {
    return this.goods.length === 0;
  }

  async loadSearchResults() {
    try {
      const resp = await this
        .rest
        .searchGoodsByAnyField(this.selected_page, this.page_size, this.query, this.filter);

      if (resp['meta'].success) {
        this.goods = resp['data']['goods'];
        this.total = resp['data']['total'];
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

    this.resetPagination();
    await this.loadSearchResults();
  }

  async filterByCity() {
    if (this.selected_city) {
      if (this.selected_city['all']) {
        delete this.filter['city'];
      } else {
        this.filter['city'] = this.selected_city['_id'];
      }
    }

    this.resetPagination();
    await this.loadSearchResults();
  }

  async loadCities() {
    const resp = await this.rest.getAllCities();
    this.cities = resp['data']['cities'];
  }

  async filterByRating() {
    this.filter['rating'] = this.rating;

    this.resetPagination();
    await this.loadSearchResults();
  }

  async moveToPage() {
    await this.loadSearchResults();
  }
}
