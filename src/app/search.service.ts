import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {RestApiService} from './rest-api.service';
import {DataService} from './data.service';
import {Router} from '@angular/router';
import {stringify} from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  result = new BehaviorSubject({
    'goods': [],
    'total': 0
  });

  invoked = new BehaviorSubject({
    query: '',
    filter: {}
  });

  private _filter: any;

  private _query: string;

  constructor(
    private rest: RestApiService,
    private data: DataService,
    private router: Router
  ) {
    this.reset();
  }

  reset() {
    this._filter = {};
    this._query = '';

    this.city = this.data.getPreferredCity();
  }

  get PAGE_SIZE() {
    return 5;
  }

  get query(): string {
    return this._query;
  }

  set query(value: string) {
    this._query = value;
  }

  get filter(): any {
    const obj = {};
    return Object.assign(obj, this._filter);
  }

  set filter(value: any) {
    this._filter = Object.assign({}, value);
  }

  get category() {
    return { '_id': this._filter['category'] };
  }

  set category(value: any) {
    if (value && value['_id']) {
      this._filter['category'] = value['_id'];
    } else {
      delete this._filter['category'];
    }
  }

  get city() {
    return { '_id': this._filter['city'] };
  }

  set city(value: any) {
    if (value && value['_id']) {
      this._filter['city'] = value['_id'];
    } else {
      delete this._filter['city'];
    }
  }

  get rating() {
    if (this._filter['rating']) {
      return this._filter['rating'];
    } else {
      return 0;
    }
  }

  set rating(value: number) {
    this._filter['rating'] = value;
  }

  get pricing() {
    return {
      min: this._filter['min_price'] || 0,
      max: this._filter['max_price'] || Number.MAX_VALUE
    };
  }

  set pricing(value: any) {
    const min = value['min'] || 0;
    const max = value['max'] || Number.MAX_VALUE;

    this._filter['min_price'] = min;
    this._filter['max_price'] = max;
  }

  navigate() {
    this.router.navigate(['/search'], {
      queryParams: {
        query: this.query,
        filter: stringify(this.filter)
      }
    })
      .then(() => {})
      .catch(() => {});
  }

  invoke(query: string, filter: string, pageNumber: number, pageSize: number = null) {
    pageSize = pageSize || this.PAGE_SIZE;

    this
      .rest
      .searchGoodsByAnyField(
        pageNumber, pageSize, query, filter
      )
      .then(resp => {
        if (resp['meta'].success) {
          this.result.next({
            'goods': resp['data']['goods'],
            'total': resp['data']['total']
          });
        } else {
          this
            .data
            .addToast('Ошибка', resp['meta'].message, 'error');
        }
      })
      .catch(error => {
        this
          .data
          .addToast('Ошибка', error['message'], 'error');
      });
  }
}
