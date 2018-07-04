import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {StoreCategoryChooserComponent} from '../store-category-chooser/store-category-chooser.component';
import {RestApiService} from '../rest-api.service';
import {DataService} from '../data.service';

@Component({
  selector: 'app-good-category-chooser',
  templateUrl: './good-category-chooser.component.html',
  styleUrls: ['./good-category-chooser.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GoodCategoryChooserComponent),
      multi: true
    }
  ]
})
export class GoodCategoryChooserComponent implements OnInit, ControlValueAccessor {

  dropdown_menu = false;

  categories: Array<any>;

  new_category_name: string;

  selected_category = {};

  onChange = (value: any) => {};

  onTouch = () => {};

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    const resp = await this.rest.getAllGoodCategories();
    this.categories = resp['data']['categories'];
  }

  selectCategory(category: any) {
    this.selected_category = category;
    this.hideMenu();
    this.onChange(this.selected_category);
  }

  toggleMenu() {
    this.dropdown_menu = !this.dropdown_menu;
    this.onTouch();
  }

  hideMenu() {
    this.dropdown_menu = false;
  }

  async addNewCategory() {
    const index = this
      .categories
      .findIndex(category => category.name === this.new_category_name);
    if (index !== -1) {
      this
        .data
        .addToast('Ошибка', 'Такая категория уже есть', 'error');
      return;
    }
    try {
      const resp = await this.rest.addGoodCategory({
        name: this.new_category_name
      });

      if (resp['meta'].success) {
        this.categories.push(resp['data']['category']);
        this.new_category_name = '';
        this.selectCategory(this.categories[this.categories.length - 1]);
      } else {
        this
          .data
          .addToast('Ошибка', resp['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error.toString(), 'error');
    }
  }

  get value() {
    return this.selected_category;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    if (obj && obj.name && obj.user) {
      this.selectCategory(obj);
    }
  }

}
