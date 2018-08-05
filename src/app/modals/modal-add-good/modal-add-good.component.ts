import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {UploadFileService} from '../../upload-file.service';

@Component({
  selector: 'app-modal-add-good',
  templateUrl: './modal-add-good.component.html',
  styleUrls: ['./modal-add-good.component.scss']
})
export class ModalAddGoodComponent implements OnInit {

  store_id: string;

  city_id: string;

  name: string;

  price: number;

  picture: string;

  type: string;

  preview_url: string = null;

  preview_path: any = null;

  preview_file: any = null;

  tags = [];

  category: any;

  btnDisabled = false;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private rest: RestApiService,
    private data: DataService,
    private fileUploader: UploadFileService
  ) { }

  ngOnInit() {
  }

  get shopOwnerProfit(): string {
    if (isNaN(this.price)) {
      return '0.00';
    } else {
      const profit: number = this.price * 0.97;
      return profit.toFixed(2);
    }
  }

  previewImageChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.preview_file = fileList[0];

      const reader = new FileReader();
      reader.readAsDataURL(this.preview_file);

      reader.onloadend = f_event => {
        this.preview_url = f_event.target['result'];
      };
    }
  }

  deletePreview() {
    this.preview_url = null;
    this.preview_path = null;
  }

  validate(): boolean {
    if (this.name) {
      if (this.price) {
        if (this.preview_url) {
          if (this.tags.length > 0) {
            if (this.category) {
              return true;
            } else {
              this
                .data
                .addToast('Ошибка', 'Укажите категорию товара', 'error');
              return false;
            }
          } else {
            this
              .data
              .addToast('Ошибка', 'Добавьте хотя бы один тег', 'error');
            return false;
          }
        } else {
          this
            .data
            .addToast('Ошибка', 'Добавьте изображение товара', 'error');
          return false;
        }
      } else {
        this
          .data
          .addToast('Ошибка', 'Введите цену товара', 'error');
        return false;
      }
    } else {
      this
        .data
        .addToast('Ошибка', 'Введите название товара', 'error');
      return false;
    }
  }

  updateCategory(category: any) {
    this.category = category;
  }

  async createGood() {
    console.log(this.city_id);
    if (this.validate()) {
      this.btnDisabled = true;

      try {
        const pictureUrl = await this
          .fileUploader
          .uploadImage(this.preview_file);

        const resp = await this.rest.createGood({
          store_id: this.store_id,
          city: this.city_id,
          name: this.name,
          price: this.price,
          picture: pictureUrl,
          tags: this.tags.map(item => item['value']),
          category: this.category['_id']
        });

        if (resp['meta'].success) {
          this
            .data
            .addToast('Ура!', resp['meta'].message, 'success');

          const _id = resp['data']['good']['_id'];

          await this.router.navigate(['/good', _id]);

          this.activeModal.close();
        } else {
          this
            .data
            .addToast('Ошибка', resp['meta'].message, 'error');
        }

      } catch (error) {
        this
          .data
          .addToast('Ошибка', error['meta'].message, 'error');
      }

      this.btnDisabled = false;
    }
  }

}
