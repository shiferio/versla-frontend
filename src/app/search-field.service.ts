import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchFieldService {

  dropdown_visible = false;

  dropdown_menu = [
    'Везде', 'В этом магазине'
  ];

  selected: string;

  store_info: any;

  reset() {
    this.dropdown_visible = false;
    this.selected = this.dropdown_menu[0];
    this.store_info = null;
  }

  show() {
    this.dropdown_visible = true;
  }

  hide() {
    this.dropdown_visible = false;
  }

  everywhere() {
    this.selected = this.dropdown_menu[0];
  }

  store() {
    this.selected = this.dropdown_menu[1];
  }

  constructor() { }

}
