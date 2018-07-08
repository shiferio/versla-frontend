import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchFieldService {

  query_changed = new BehaviorSubject('');

  search_by_category = new BehaviorSubject({});

  constructor() { }

}
