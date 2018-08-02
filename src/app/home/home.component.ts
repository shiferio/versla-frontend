import {Component, OnInit} from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {CartService} from '../cart.service';
import {DataService} from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  goods = [];
  email: string;

  constructor(
    private rest: RestApiService,
    private data: DataService
  ) {
  }

  async ngOnInit() {
    await this.loadGoods();
    this.data.setTitle('Главная');
  }

  async loadGoods() {
    const resp = await this.rest.getAllGoods(1, 6);
    this.goods = resp['data']['goods'] || [];
  }

  async onGoodDeleted(good_info: any) {
    await this.loadGoods();
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validate(): boolean {
    if (this.email) {
      if (this.validateEmail(this.email)) {
        return true;
      } else {
        this
          .data
          .addToast('Ошибка', 'Некорректный email', 'error');
        return false;
      }
    } else {
      this
        .data
        .addToast('Ошибка', 'Вы не ввели email', 'error');
      return false;
    }
  }

  async subscribe() {
    if (this.validate()) {
      const data = await this
        .rest
        .subscribe({
          email: this.email,
        });
      if (data['meta'].success) {
        this
          .data.addToast('Вы успешно подписаны', '', 'success');
      } else {
        this
          .data.addToast('Не удалось подписаться', '', 'error');
      }
    }
  }

}
