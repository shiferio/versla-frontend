import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';
import {UploadFileService} from '../../upload-file.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-modal-add-good',
  templateUrl: './modal-add-good.component.html',
  styleUrls: ['./modal-add-good.component.scss']
})
export class ModalAddGoodComponent implements OnInit {

  store: any;

  city_id: string;

  name = new FormControl('', Validators.required);

  price = new FormControl('', Validators.required);

  picture: string;

  type: string;

  preview_url: string = null;

  preview = new FormControl('', Validators.required);

  preview_file: any = null;

  tags = new FormControl([], Validators.required);

  category = new FormControl(null, Validators.required);

  volume = new FormControl('', Validators.required);

  purchaseEnabled = new FormControl(false);

  wholesalePrice = new FormControl('');

  minVolume = new FormControl('');

  purchaseForm: FormGroup;

  btnDisabled = false;

  form: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private rest: RestApiService,
    private data: DataService,
    private fileUploader: UploadFileService,
    private builder: FormBuilder
  ) { }

  ngOnInit() {
    this.purchaseForm = this.builder.group({
      'purchaseEnabled': this.purchaseEnabled,
      'minVolume': this.minVolume
    }, {
      validator: Validators.compose([this.minVolumeValidate, this.wholesalePriceValidate])
    });

    if (this.store.goods_type !== 'retail') {
      this.purchaseForm.addControl('wholesalePrice', this.wholesalePrice);
    }

    this.form = this.builder.group({
      'name': this.name,
      'preview': this.preview,
      'price': this.price,
      'tags': this.tags,
      'category': this.category,
      'volume': this.volume,
      'purchaseForm': this.purchaseForm
    });
  }

  minVolumeValidate(group: FormGroup) {
    const purchaseEnabled = group.controls['purchaseEnabled'];
    const minVolume = group.controls['minVolume'];
    minVolume.setErrors(null);

    if (purchaseEnabled.value && !minVolume.value) {
      minVolume.setErrors({
        required: true
      });
    }

    return null;
  }

  wholesalePriceValidate(group: FormGroup) {
    const wholesalePrice = group.controls['wholesalePrice'];
    const purchaseEnabled = group.controls['purchaseEnabled'];
    if (!wholesalePrice) {
      return null;
    }

    wholesalePrice.setErrors(null);

    if (purchaseEnabled.value && !wholesalePrice.value) {
      wholesalePrice.setErrors({
        required: true
      });
    }

    return null;
  }

  get shopOwnerProfit(): string {
    if (isNaN(this.price.value)) {
      return '0.00';
    } else {
      const profit: number = this.price.value * 0.97;
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
    this.preview_file = null;
    this.preview.reset();
  }

  updateCategory(category: any) {
    this.category.setValue(category);
  }

  async createGood() {
      this.btnDisabled = true;

      try {
        const pictureUrl = await this
          .fileUploader
          .uploadImage(this.preview_file);
        const data = {
          store_id: this.store['_id'],
          city: this.city_id,
          name: this.name.value,
          price: this.price.value,
          picture: pictureUrl,
          tags: this.tags.value.map(item => item['value']),
          category: this.category.value['_id'],
          volume: Number.parseFloat(this.volume.value)
        };

        if (this.purchaseEnabled.value) {
          data['purchase_info'] = {
            'min_volume': Number.parseFloat(this.minVolume.value),
            'purchase_enabled': this.purchaseEnabled.value,
            'wholesale_price': Number.parseFloat(this.wholesalePrice.value)
          };
        }

        const resp = await this.rest.createGood(data);

        this
          .data
          .addToast('Товар добавлен', '', 'success');

        const _id = resp['data']['good']['_id'];

        await this
          .router
          .navigate(['/good', _id]);

        this
          .activeModal
          .close();
      } catch (error) {
        this
          .data
          .addToast('Ошибка', error['error']['meta'].message, 'error');
      }

      this.btnDisabled = false;
    }

}
