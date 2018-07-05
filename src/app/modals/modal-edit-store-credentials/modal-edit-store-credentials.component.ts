import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';

@Component({
  selector: 'app-modal-edit-store-credentials',
  templateUrl: './modal-edit-store-credentials.component.html',
  styleUrls: ['./modal-edit-store-credentials.component.scss']
})
export class ModalEditStoreCredentialsComponent implements OnInit {

  storeInfo: any;

  name = '';

  link = '';

  goods_type = 'retail';

  tax_num = '';

  state_num = '';

  bank_type = 'card';

  bank_num = '';

  resident_type = 'individual';

  city: any;

  category: any;

  btnDisabled = false;

  constructor(public activeModal: NgbActiveModal,
              private rest: RestApiService,
              private data: DataService) {
  }

  ngOnInit() {
    this.name = this.storeInfo.name;
    this.goods_type = this.storeInfo.goods_type;
    this.tax_num = this.storeInfo.tax_num;
    this.state_num = this.storeInfo.state_num;
    this.bank_type = this.storeInfo.bank_type;
    this.bank_num = this.storeInfo.bank_num;
    this.resident_type = this.storeInfo.resident_type;
    this.city = this.storeInfo.city;
    this.category = this.storeInfo.category;
  }

  closeModal() {
    this
      .activeModal
      .close('Modal closed');
  }

  validate() {
    if (this.city) {
      if (this.category) {
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
          .data.addToast('Ошибка', 'Вы не выбрали категорию!', 'error');
      }
    } else {
      this
        .data.addToast('Ошибка', 'Вы не выбрали город!', 'error');
    }

    return false;
  }

  async updateResidentInfo() {
    const data = await this
      .rest
      .updateStoreInfo(this.storeInfo.link, 'resident', {
        link: this.storeInfo.link,
        tax_num: this.tax_num,
        state_num: this.state_num,
        bank_type: this.bank_type,
        bank_num: this.bank_num,
        resident_type: this.resident_type,
        goods_type: this.goods_type
      });

    if (data['meta'].success) {
      return true;
    } else {
      this
        .data.addToast('Ошибка', data['meta'].message, 'error');
      return false;
    }
  }

  async updateCity() {
    const data = await this
      .rest
      .updateStoreInfo(this.storeInfo.link, 'contacts', {
        link: this.storeInfo.link,
        city: this.city['_id']
      });

    if (data['meta'].success) {
      return true;
    } else {
      this
        .data.addToast('Ошибка', data['meta'].message, 'error');
      return false;
    }
  }

  async updateCategory() {
    const data = await this
      .rest
      .updateStoreInfo(this.storeInfo.link, 'category', {
        link: this.storeInfo.link,
        category: this.category['_id']
      });

    if (data['meta'].success) {
      return true;
    } else {
      this
        .data.addToast('Ошибка', data['meta'].message, 'error');
      return false;
    }
  }

  async updateInfo() {
    this.btnDisabled = true;

    try {
      if (this.validate()) {
        const ok = (await this.updateResidentInfo()) &&
          (await this.updateCity()) &&
          (await this.updateCategory());
        if (ok) {
          this.closeModal();
          this
            .data.addToast('Данные обновлены', '', 'success');
        }
      }
    } catch (error) {
      this
        .data.addToast('Ошибка', error['message'], 'error');
    }
    this.btnDisabled = false;
  }

  onCategoryChanged(category: any) {
    this.category = category;
  }
}
