import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

@Component({
  selector: 'app-modal-add-good',
  templateUrl: './modal-add-good.component.html',
  styleUrls: ['./modal-add-good.component.scss']
})
export class ModalAddGoodComponent implements OnInit {

  store_id: string;

  name: string;

  price: number;

  picture: string;

  type: string;

  preview_url: string = null;

  preview_path: any = null;

  preview_file: any = null;

  tags = [];

  available_types = [
    'one', 'two', 'three'
  ];

  btnDisabled = false;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private rest: RestApiService,
    private data: DataService
  ) { }

  ngOnInit() {
  }

  get shopOwnerProfit(): string {
    if (isNaN(this.price)) {
      return '0';
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
            if (this.type) {
              return true;
            } else {
              this
                .data
                .addToast('Ошибка', 'Укажите тип товара', 'error');
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

  async createGood() {
    if (this.validate()) {
      this.btnDisabled = true;

      const formData: FormData = new FormData();
      formData.append('image', this.preview_file, this.preview_file.name);

      const data = await this.rest.uploadImage(formData);

      try {
        const resp = await this.rest.createGood({
          store_id: this.store_id,
          name: this.name,
          price: this.price,
          picture: data['file'],
          tags: this.tags.map(item => item['value']),
          type: this.type
        });

        if (resp['meta'].success) {
          this
            .data
            .addToast('Ура!', resp['meta'].message, 'success');

          const good_id = resp['data']['good']['good_id'];

          await this.router.navigate(['/good', good_id]);

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
