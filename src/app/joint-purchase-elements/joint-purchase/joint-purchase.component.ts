import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../../rest-api.service';
import { DataService } from '../../data.service';
import { CartService } from '../../cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from '../../search.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {ModalJoinToJointPurchaseComponent} from '../../modals/modal-join-to-joint-purchase/modal-join-to-joint-purchase.component';

@Component({
  selector: 'app-joint-purchase',
  templateUrl: './joint-purchase.component.html',
  styleUrls: ['./joint-purchase.component.scss']
})
export class JointPurchaseComponent implements OnInit {

  private routeSub: Subscription;

  purchaseId: string;

  purchaseInfo: any = {};

  editMode: any = {};

  additionalTabPane = 'description';

  date = {};

  participants = [];

  constructor(
    private route: ActivatedRoute,
    private rest: RestApiService,
    private data: DataService,
    private cart: CartService,
    private modalService: NgbModal,
    private search: SearchService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();

    this.routeSub = this.route.params.subscribe(async (params) => {
      this.purchaseId = params['purchase_id'];

      await this.initialize();

      this.spinner.hide();
    });
  }

  async initialize() {
    const resp = await this.rest.getJointPurchaseById(this.purchaseId);
    await this.loadAdditionalInfo(resp['data']['purchase']);
  }

  get isCreator(): boolean {
    return this.purchaseInfo &&
      this.data.user &&
      this.purchaseInfo['creator']['_id'] === this.data.user['_id'];
  }

  get isJoint(): boolean {
    if (this.purchaseInfo && this.data.user) {
      const index = this
        .purchaseInfo['participants']
        .findIndex(participant => participant['user'] === this.data.user['_id']);
      return index !== -1;
    } else {
      return false;
    }
  }

  get history(): Array<any> {
    const reversed = Array.from(this.purchaseInfo['history']);
    reversed.reverse();
    return reversed;
  }

  get measurementUnit(): string {
    return this.purchaseInfo['measurement_unit']['name'];
  }

  async loadAdditionalInfo(purchase_info: any) {
    this.purchaseInfo = purchase_info;

    this.participants = await Promise.all(
      this
        .purchaseInfo['participants']
        .map(async (participant) => {
          const data = Object.create(participant);
          const resp = await this.rest.getUserById(participant['user']);

          data['user'] = resp['data']['user'];
          data['cost'] = participant['volume'] * this.purchaseInfo['price_per_unit'];
          return data;
      }));

    for (const item of this.purchaseInfo['history']) {
      if (item['parameter'] === 'category') {
        const resp = await this.rest.getGoodCategoryById(item['value']);
        console.log(resp);
        item['value'] = resp['data']['category']['name'];
      }
    }
  }

  async purchaseImageChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('image', file, file.name);
      const data = await this.rest.uploadImage(formData);

      try {
        const resp = await this
          .rest
          .updatePurchaseInfo(
            this.purchaseInfo['_id'],
            'picture',
            data['file']
          );

        if (resp['meta'].success) {
          this
            .data
            .success('Информация обновлена');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    }
  }

  async updateName() {
    if (this.purchaseInfo['name']) {
      this.editMode['name'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'name',
          this.purchaseInfo['name']
        );

        if (resp['meta'].success) {
          this
            .data
            .success('Информация обновлена');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    } else {
      this
        .data
        .error('Название закупки не может быть пустой строкой');
    }
  }

  async updatePrice() {
    if (this.purchaseInfo['price_per_unit']) {
      this.editMode['price_per_unit'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'price_per_unit',
          Number.parseFloat(this.purchaseInfo['price_per_unit'])
        );

        if (resp['meta'].success) {
          this
            .data
            .success('Информация обновлена');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    } else {
      this
        .data
        .error('Вы не указали цену');
    }
  }

  async updateVolume() {
    if (this.purchaseInfo['volume']) {
      this.editMode['volume'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'volume',
          Number.parseFloat(this.purchaseInfo['volume'])
        );

        if (resp['meta'].success) {
          this
            .data
            .success('Информация обновлена');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    } else {
      this
        .data
        .error('Вы не количество товара');
    }
  }

  async updateMinVolume() {
    if (this.purchaseInfo['min_volume']) {
      this.editMode['minVolume'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'min_volume',
          Number.parseFloat(this.purchaseInfo['min_volume'])
        );

        if (resp['meta'].success) {
          this
            .data
            .success('Информация обновлена');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    } else {
      this
        .data
        .error('Вы не количество товара');
    }
  }

  async updateCategory(category: any) {
    this.purchaseInfo['category'] = category;

    this.editMode['category'] = false;
    try {
      const resp = await this.rest.updatePurchaseInfo(
        this.purchaseInfo['_id'],
        'category',
        category['_id']
      );

      if (resp['meta'].success) {
        this
          .data
          .success('Информация обновлена');

        await this.loadAdditionalInfo(resp['data']['purchase']);
      } else {
        this
          .data
          .error(resp['meta'].message);
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

  async updateDescription() {
    if (this.purchaseInfo['description']) {
      this.editMode['description'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'description',
          this.purchaseInfo['description']
        );

        if (resp['meta'].success) {
          this
            .data
            .success('Информация обновлена');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    } else {
      this
        .data
        .error('Нет описания закупки');
    }
  }

  async updateDate() {
    if (this.date) {
      this.editMode['date'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'date',
          new Date(this.date['year'], this.date['month'], this.date['day'])
        );

        if (resp['meta'].success) {
          this
            .data
            .success('Информация обновлена');

          await this.loadAdditionalInfo(resp['data']['purchase']);
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    } else {
      this
        .data
        .error('Укажите дату');
    }
  }

  async joinToPurchase() {
    const modalRef = this.modalService.open(ModalJoinToJointPurchaseComponent);

    modalRef.componentInstance.purchaseInfo = this.purchaseInfo;

    modalRef.result.then(async (purchaseInfo) => {
      if (purchaseInfo) {
        await this.loadAdditionalInfo(purchaseInfo);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async detachFromPurchase() {
    try {
      const resp = await this.rest.detachFromPurchase(this.purchaseInfo['_id']);

      if (resp['meta'].success) {
        this
          .data
          .addToast('Вы отсоединились от закупки', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
      } else {
        this
          .data
          .addToast('Не удалось отсоединиться от закупки', '', 'success');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error['message'], 'error');
    }
  }
}
