import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NodeModel} from '../node-model';

export class Settings {
  selectOnlyLeafs: boolean;
  description: string;
  backToTopTitle: string;
}

@Component({
  selector: 'app-category-nested-list',
  templateUrl: './category-nested-list.component.html',
  styleUrls: ['./category-nested-list.component.scss']
})
export class CategoryNestedListComponent implements OnInit {

  @Output('selected')
  selected = new EventEmitter<NodeModel>();

  @Input('settings')
  settings: Settings = {
    selectOnlyLeafs: false,
    description: 'Категории',
    backToTopTitle: 'Назад'
  };

  @Input('data')
  set data(items: Array<NodeModel>) {
    this.activeItem = {
      id: null,
      name: this.settings.description,
      children: items
    };
  }

  activeItem: NodeModel = {
    id: null,
    name: this.settings.description,
    children: []
  };

  history: Array<NodeModel> = [];

  constructor() { }

  ngOnInit() {
  }

  showSubitems(event: Event, item: NodeModel) {
    event.stopPropagation();

    this.history.push(this.activeItem);
    this.activeItem = item;
  }

  itemSelected(event: Event, item: NodeModel) {
    event.stopPropagation();

    if (!this.settings.selectOnlyLeafs || item.children.length === 0) {
      this.selected.emit(item);
    }
  }

  backToTop(event: Event) {
    event.stopPropagation();

    this.activeItem = this.history.pop();
  }

}
