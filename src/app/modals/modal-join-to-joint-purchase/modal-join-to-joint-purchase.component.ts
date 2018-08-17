import {Component, Input, OnInit} from '@angular/core';
import {RestApiService} from '../../rest-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '../../data.service';

@Component({
  selector: 'app-modal-join-to-joint-purchase',
  templateUrl: './modal-join-to-joint-purchase.component.html',
  styleUrls: ['./modal-join-to-joint-purchase.component.scss']
})
export class ModalJoinToJointPurchaseComponent implements OnInit {
  @Input('purchaseInfo')
  purchaseInfo: any;

  @Input('fakeUser')
  fakeUser = false;

  volume: any;

  userLogin: string;

  validated = false;

  constructor(
    private rest: RestApiService,
    private activeModal: NgbActiveModal,
    private data: DataService
  ) { }

  ngOnInit() {
    this.volume = this.purchaseInfo['min_volume'];
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  get cost(): number {
    return this.volume * this.purchaseInfo['price_per_unit'];
  }

  get minimum(): number {
    return this.purchaseInfo['min_volume'];
  }

  get maximum(): number {
    return this.purchaseInfo['remaining_volume'];
  }

  get measurementUnit(): string {
    return this.purchaseInfo['measurement_unit']['name'];
  }

  validate() {
    this.validated = true;

    if (this.volume > this.purchaseInfo['remaining_volume']) {
      this
        .data
        .addToast('Нельзя заказать больше, чем доступно', '', 'error');
      return false;
    }

    if (this.volume < this.purchaseInfo['min_volume']) {
      this
        .data
        .addToast('Нельзя заказть меньше допустимого объема', '', 'error');
      return false;
    }

    if (this.fakeUser && !this.userLogin) {
      this
        .data
        .addToast('Введите имя пользователя', '', 'error');
      return false;
    }

    return true;
  }

  async joinToPurchase() {
    if (!this.validate()) {
      return;
    }
    if (!this.fakeUser) {
      try {
        const resp = await this.rest.joinToPurchase(
          this.purchaseInfo['_id'],
          Number.parseFloat(this.volume)
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Вы присоединены к закупке', '', 'success');
          this.activeModal.close(resp['data']['purchase']);
        } else {
          this
            .data
            .addToast('Не удалось присоединится к закупке', '', 'error');
        }
      } catch (error) {
        this
          .data
          .addToast('Ошибка', error['message'], 'error');
      }
    } else {
      try {
        const resp = await this.rest.joinFakeUserToPurchase(
          this.purchaseInfo['_id'],
          this.userLogin,
          Number.parseFloat(this.volume)
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Пользователь присоединен к закупке', '', 'success');
          this.activeModal.close(resp['data']['purchase']);
        } else {
          this
            .data
            .addToast('Не удалось присоединить к закупке', '', 'error');
        }
      } catch (error) {
        this
          .data
          .addToast('Ошибка', error['message'], 'error');
      }
    }
  }

}
