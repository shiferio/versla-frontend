import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  onSearchChanged = new BehaviorSubject({});

  constructor() { }

}
