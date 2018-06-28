import {Component, OnInit, Input} from '@angular/core';
import {CartService} from '../../cart.service';

@Component({
  selector: 'app-item-params',
  templateUrl: './item-params.component.html',
  styleUrls: ['./item-params.component.scss']
})
export class ItemParamsComponent implements OnInit {

  @Input('item')
  item: any;

  @Input('readonly')
  readonly: boolean;

  userParams = {};

  constructor(
    private cart: CartService
  ) {
  }

  ngOnInit() {
    this.item.values.forEach(value => {
      this.userParams[value.name] = value.value;
    });
  }

  async onParamChanged(name: any) {
    const value = this.userParams[name];

    await this.cart.setItemParamValue(this.item._id, name, value);
  }
}
