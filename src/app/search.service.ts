import {Injectable} from '@angular/core';
import {Subject, BehaviorSubject} from 'rxjs';
import {RestApiService} from './rest-api.service';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  result = new BehaviorSubject({
    'goods': [],
    'total': 0
  });

  private _filter: any;

  private _query: string;

  constructor(
    private rest: RestApiService,
    private data: DataService
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

  invoke(pageNumber: number, pageSize: number = null) {
    pageSize = pageSize || this.PAGE_SIZE;

    this
      .rest
      .searchGoodsByAnyField(
        pageNumber, pageSize, this._query, this._filter
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
