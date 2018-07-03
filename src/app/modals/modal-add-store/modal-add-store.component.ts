import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-modal-add-store',
  templateUrl: './modal-add-store.component.html',
  styleUrls: ['./modal-add-store.component.scss']
})
export class ModalAddStoreComponent implements OnInit {

  name = '';

  link = '';

  goods_type = 'retail';

  tax_num = '';

  state_num = '';

  bank_type = 'card';

  bank_num = '';

  resident_type = 'individual';

  city = {};

  btnDisabled = false;

  constructor(public activeModal: NgbActiveModal, private router: Router, private rest: RestApiService, private data: DataService) {
  }

  ngOnInit() {
  }

  closeModal() {
    this
      .activeModal
      .close('Modal closed');
  }

  validate() {
    if (this.city) {
      if (this.name) {
        if (this.link) {
          if (this.resident_type === 'entity' && this.tax_num.length === 10 ||
            this.resident_type === 'individual' && this.tax_num.length === 12
          ) {
            if (this.resident_type === 'entity' && this.state_num ||
              this.resident_type === 'individual'
            ) {
              if (this.bank_type === 'card' && this.bank_num.length === 16 ||
                this.bank_type === 'num' && this.bank_num.length === 20
              ) {
                return true;
              } else {
                this
                  .data.addToast('Ошибка', 'Введите корректный № счета/карты', 'error');
              }
            } else {
              this
                .data.addToast('Ошибка', 'Введите корректный ОГРН', 'error');
            }
          } else {
            this
              .data.addToast('Ошибка', 'Введите корректный ИНН', 'error');
          }
        } else {
          this
            .data.addToast('Ошибка', 'Вы не ввели ссылку!', 'error');
        }
      } else {
        this
          .data.addToast('Ошибка', 'Вы не ввели название магазина!', 'error');
      }
    } else {
        this
          .data.addToast('Ошибка', 'Вы не выбрали город!', 'error');
    }

    return false;
  }

  async createStore() {
    this.btnDisabled = true;

    try {
      if (this.validate()) {
        const data = await this
          .rest
          .createStore({
            name: this.name,
            link: this.link,
            tax_num: this.tax_num,
            state_num: this.state_num,
            bank_type: this.bank_type,
            bank_num: this.bank_num,
            resident_type: this.resident_type,
            goods_type: this.goods_type,
            city: this.city['_id']
          });
        if (data['meta'].success) {
          await this
            .data
            .getProfile();
          this.closeModal();
          this
            .data.addToast('Магазин успешно добавлен', data['meta'].message, 'success');

          await this.router.navigate(['/store', this.link]);
        } else {
          this
            .data.addToast('Ошибка', data['meta'].message, 'error');
        }
      }
    } catch (error) {
      this
        .data.addToast('Ошибка', error['messsage'], 'error');
    }
    this.btnDisabled = false;
  }
}
