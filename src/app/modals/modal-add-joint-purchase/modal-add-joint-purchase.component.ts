import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {environment} from '../../../environments/environment';
import {UploadFileService} from '../../upload-file.service';

@Component({
  selector: 'app-modal-add-joint-purchase',
  templateUrl: './modal-add-joint-purchase.component.html',
  styleUrls: ['./modal-add-joint-purchase.component.scss']
})
export class ModalAddJointPurchaseComponent implements OnInit {

  name: string;

  description: string;

  category: any;

  address: string;

  volume: string;

  minVolume: string;

  pricePerUnit: string;

  measurementUnit: any;

  date: any;

  paymentType: number = null;

  pictureUrl: string = null;

  picturePath: any = null;

  paymentInfo: string;

  isPrivate = false;

  private pictureFile: any = null;

  constructor(
    private activeModal: NgbActiveModal,
    private router: Router,
    private rest: RestApiService,
    private data: DataService,
    private fileUploader: UploadFileService
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.activeModal.close('dismissed');
  }

  get total(): number {
    const volume = Number.parseFloat(this.volume) || 0;
    const price = Number.parseFloat(this.pricePerUnit) || 0;
    return volume * price;
  }

  imageChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.pictureFile = fileList[0];

      const reader = new FileReader();
      reader.readAsDataURL(this.pictureFile);

      reader.onloadend = f_event => {
        this.pictureUrl = f_event.target['result'];
      };
    }
  }

  deleteImage() {
    this.pictureUrl = null;
    this.picturePath = null;
  }

  updateCategory(category: any) {
    this.category = category;
  }

  updateUnit(unit: any) {
    this.measurementUnit = unit;
  }

  validate() {
    if (!this.name) {
      this
        .data
        .addToast('Введите название', '', 'error');
      return false;
    }

    if (!this.pictureUrl) {
      this
        .data
        .addToast('Добавьте изображение', '', 'error');
      return false;
    }

    if (!this.description) {
      this
        .data
        .addToast('Введите описание', '', 'error');
      return false;
    }

    if (!this.address) {
      this
        .data
        .addToast('Введите адрес', '', 'error');
      return false;
    }

    if (!this.category) {
      this
        .data
        .addToast('Выберите категорию', '', 'error');
      return false;
    }

    if (!this.volume) {
      this
        .data
        .addToast('Введите количество товара', '', 'error');
      return false;
    }

    if (!this.minVolume) {
      this
        .data
        .addToast('Введите объем минимального заказа', '', 'error');
      return false;
    }

    if (!this.measurementUnit) {
      this
        .data
        .addToast('Укажите единицу измерения', '', 'error');
      return false;
    }

    if (!this.pricePerUnit) {
      this
        .data
        .addToast('Укажите цену за единицу товара', '', 'error');
      return false;
    }

    if (!this.date) {
      this
        .data
        .addToast('Укажите дату завершения закупки', '', 'error');
      return false;
    }

    if (this.paymentType === null) {
      this
        .data
        .addToast('Укажите способ оплаты', '', 'error');
      return false;
    }

    if (this.paymentType === 1 && !this.paymentInfo) {
      this
        .data
        .addToast('Введите платежную информацию', '', 'error');
      return false;
    }

    return true;
  }

  async createPurchase() {
    if (this.validate()) {
      try {
        const pictureUrl = await this.fileUploader.uploadImage(this.pictureFile);
        const resp = await this.rest.addJointPurchase({
          name: this.name,
          picture: pictureUrl,
          description: this.description,
          category_id: this.category['_id'],
          address: this.address,
          volume: Number.parseFloat(this.volume),
          min_volume: Number.parseFloat(this.minVolume),
          price_per_unit: Number.parseFloat(this.pricePerUnit),
          measurement_unit_id: this.measurementUnit['_id'],
          date: new Date(this.date['year'], this.date['month'], this.date['day']),
          state: 0,
          payment_type: this.paymentType,
          payment_info: this.paymentInfo,
          is_public: !this.isPrivate
        });

        if (resp['meta'].success) {
          this
            .data
            .addToast('Закупка создана', '', 'success');

          const id = resp['data']['purchase']['_id'];

          await this.router.navigate(['/purchase', id]);

          this.activeModal.close();
        } else {
          this
            .data
            .addToast('Ошибка', resp['meta'].message, 'error');
        }

      } catch (error) {
        this
          .data
          .addToast('Ошибка', error.message, 'error');
      }
    }
  }
}
