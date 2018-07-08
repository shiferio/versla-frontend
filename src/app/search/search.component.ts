import {AfterContentInit, AfterViewInit, Component, OnInit, OnDestroy} from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {SearchService} from '../search.service';
import {DataService} from '../data.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {stringify, parse} from 'querystring';
import {SearchFieldService} from '../search-field.service';

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

  invoked_sub: Subscription;

  query_field_sub: Subscription;

  query_params_sub: Subscription;

  category_sub: Subscription;

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

    this.invoked_sub = this.search.invoked.subscribe(async (data) => {
      await this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: {
            query: data['query'],
            filter: stringify(data['filter'])
          }
        }
      );
    });

    this.query_field_sub = this.searchField.query_changed.subscribe(query => {
      this.search.query = query;
      this.loadFilters();
      this.search.invoke(this.page_number, this.page_size);
    });

    this.category_sub = this.searchField.search_by_category.subscribe(category => {
      this.loadFilters();
    });

    // const params = this.route.snapshot.queryParamMap;
    // const query = params.get('query') || '';
    // const filter = parse(params.get('filter') || '');
    //
    // this.search.reset();
    // this.search.query = query;
    // this.search.filter = filter;
    //
    // this.loadFilters();
    // this.search.invoke(this.page_number, this.page_size);

    // this.query_params_sub = this.route.queryParamMap.subscribe(params => {
    //   const query = params.get('query') || '';
    //   const filter = parse(params.get('filter') || '');
    //
    //   this.search.reset();
    //   this.search.query = query;
    //   this.search.filter = filter;
    //
    //   this.loadFilters();
    //   this.search.invoke(this.page_number, this.page_size);
    // });
  }

  ngOnDestroy() {
    this.result_sub.unsubscribe();
    this.invoked_sub.unsubscribe();
    this.query_field_sub.unsubscribe();
    this.category_sub.unsubscribe();
    // this.query_params_sub.unsubscribe();
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
  }

  resetPagination() {
    this.page_number = 1;
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
    const cities = resp['data']['cities'];
    cities.splice(0, 0, this.default_city);
    this.cities = cities;
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
