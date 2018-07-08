import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {SearchService} from '../search.service';
import {DataService} from '../data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterContentInit {

  goods = [];

  categories = [];

  category = {};

  default_category = {
    all: true,
    name: 'Все'
  };

  cities = [];

  city = {};

  default_city = {
    all: true,
    name: 'Все'
  };

  rating = 0;

  page_size = 4;

  page_number = 1;

  total = 0;

  pricing = [10, 1000];

  constructor(
    public search: SearchService,
    private rest: RestApiService,
    private data: DataService
  ) {
  }

  async ngOnInit() {

  }

  async ngAfterContentInit() {
    await this.initialize();
    this.loadFilters();

    this.search.result.subscribe(data => {
      this.goods = data['goods'];
      this.total = data['total'];
    });
    this.search.invoke(this.page_number, this.page_size);
  }

  async initialize() {
    await this.loadCategories();
    await this.loadCities();

    this.categories.splice(0, 0, this.default_category);

    this.cities.splice(0, 0, this.default_city);
  }

  loadFilters() {
    const cityIndex = this
      .cities
      .findIndex(city => city['_id'] === this.search.city['_id']);
    this.city = this.cities[cityIndex >= 0 ? cityIndex : 0];

    this.rating = this.search.rating;
  }

  resetPagination() {
    this.page_number = 1;
  }

  get noResults(): boolean {
    return this.goods.length === 0;
  }

  get selected_category(): any {
    if (this.search.category['_id']) {
      return this.search.category;
    } else {
      return this.categories[0];
    }
  }

  async loadCategories() {
    const resp = await this.rest.getAllGoodCategories();
    this.categories = resp['data']['categories'];
  }

  async filterByCategory() {
    if (this.category) {
      if (this.category['all']) {
        this.search.category = null;
      } else {
        this.search.category = this.category;
      }
    }

    this.resetPagination();
    this.search.invoke(this.page_number, this.page_size);
  }

  async filterByCity() {
    if (this.city) {
      if (this.city['all']) {
        this.search.city = null;
      } else {
        this.search.city = this.city;
      }
    }

    this.resetPagination();
    this.search.invoke(this.page_number, this.page_size);
  }

  async loadCities() {
    const resp = await this.rest.getAllCities();
    this.cities = resp['data']['cities'];
  }

  async filterByRating() {
    this.search.rating = this.rating;

    this.resetPagination();
    this.search.invoke(this.page_number, this.page_size);
  }

  moveToPage() {
    this.search.invoke(this.page_number, this.page_size);
  }

  filterByPrice() {
    this.search.pricing = {
      min: this.pricing[0],
      max: this.pricing[1]
    };

    this.resetPagination();
    this.search.invoke(this.page_number, this.page_size);
  }

  priceChanged() {
    // for ngx-rslide
    this.pricing = [this.pricing[0], this.pricing[1]];
    this.filterByPrice();
  }

  resetFilters() {
    this.resetPagination();
    this.search.reset();
    this.loadFilters();
    this.search.invoke(0, this.page_size);
  }
}
