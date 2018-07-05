import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {DataService} from '../data.service';

@Component({
  selector: 'app-store-category-chooser',
  templateUrl: './store-category-chooser.component.html',
  styleUrls: ['./store-category-chooser.component.scss']
})
export class StoreCategoryChooserComponent implements OnInit {

  menu_visible = false;

  categories: Array<any>;

  new_category_name: string;

  @Input('category')
  category: any;

  selected_category = {};

  @Output('categoryChanged')
  categoryChanged = new EventEmitter();

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    const resp = await this.rest.getAllStoreCategories();
    this.categories = resp['data']['categories'];

    this.selected_category = this.category || {};
  }

  selectCategory(category: any) {
    this.hideMenu();
    if (this.selected_category['_id'] !== category['_id']) {
      this.selected_category = category;
      this.categoryChanged.emit(this.selected_category);
    }
  }

  toggleMenu() {
    this.menu_visible = !this.menu_visible;
  }

  hideMenu() {
    this.menu_visible = false;
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
      const resp = await this.rest.addStoreCategory({
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

}
