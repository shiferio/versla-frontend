import {Component, OnInit, OnDestroy} from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {SearchService} from '../search.service';
import {DataService} from '../data.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchFieldService} from '../search-field.service';
import {stringify} from 'querystring';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

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

  result_sub: Subscription;

  query_params_sub: Subscription;

  constructor(
    public search: SearchService,
    private rest: RestApiService,
    private data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private searchField: SearchFieldService
  ) {
  }

  async ngOnInit() {
    await this.initialize();

    this.result_sub = this.search.result.subscribe(data => {
      this.goods = data['goods'];
      this.total = data['total'];
    });

    this.query_params_sub = this.route.queryParamMap.subscribe(() => {
      this.search.url = this.router.url;

      const query = this.search.query;
      const filter = stringify(this.search.filter);
      const page_number = this.search.page_number;

      this.loadFilters();
      this.search.invoke(query, filter, page_number, this.page_size);
    });
  }

  ngOnDestroy() {
    this.result_sub.unsubscribe();
    this.query_params_sub.unsubscribe();
  }

  async initialize() {
    await this.loadCategories();
    await this.loadCities();
  }

  loadFilters() {
    const cityIndex = this
      .cities
      .findIndex(city => city['_id'] === this.search.city['_id']);
    this.city = this.cities[cityIndex >= 0 ? cityIndex : 0];

    const categoryIndex = this
      .categories
      .findIndex(category => category['_id'] === this.search.category['_id']);
    this.category = this.categories[categoryIndex >= 0 ? categoryIndex : 0];

    this.rating = this.search.rating;

    this.page_number = this.search.page_number;
  }

  resetPagination() {
    this.page_number = 1;
    this.search.page_number = this.page_number;
  }

  get noResults(): boolean {
    return this.goods.length === 0;
  }

  async loadCategories() {
    const resp = await this.rest.getAllGoodCategories();
    const categories = resp['data']['categories'];
    categories.splice(0, 0, this.default_category);
    this.categories = categories;
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
    this.search.navigate();
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
    this.search.navigate();
  }

  async loadCities() {
    const resp = await this.rest.getAllCities();
    const cities = resp['data']['cities'];
    cities.splice(0, 0, this.default_city);
    this.cities = cities;
  }

  async filterByRating() {
    this.search.rating = this.rating;

    this.resetPagination();
    this.search.navigate();
  }

  moveToPage() {
    this.search.page_number = this.page_number;
    this.search.navigate();
  }

  filterByPrice() {
    this.search.pricing = {
      min: this.pricing[0],
      max: this.pricing[1]
    };

    this.resetPagination();
    this.search.navigate();
  }

  priceChanged() {
    // for ngx-rslide
    this.pricing = [this.pricing[0], this.pricing[1]];
    this.filterByPrice();
  }

  resetFilters() {
    this.resetPagination();
    this.search.reset();
    this.search.navigate();
  }
}
