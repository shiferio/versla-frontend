import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {UploadFileService} from '../../upload-file.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-modal-add-joint-purchase',
  templateUrl: './modal-add-joint-purchase.component.html',
  styleUrls: ['./modal-add-joint-purchase.component.scss']
})
export class ModalAddJointPurchaseComponent implements OnInit {

  name = new FormControl('', Validators.required);

  description = new FormControl('');

  category = new FormControl(null, Validators.required);

  address = new FormControl('', Validators.required);

  volume = new FormControl('', Validators.required);

  minVolume = new FormControl('', Validators.required);

  pricePerUnit = new FormControl('', Validators.required);

  measurementUnit = new FormControl(null, Validators.required);

  city = new FormControl(null, Validators.required);

  date = new FormControl(null, Validators.required);

  paymentType = new FormControl(null, Validators.required);

  paymentInfo = new FormControl('');

  isPrivate = new FormControl(false);

  pictureUrl: string = null;

  picturePath = new FormControl('');

  pictureFile: any = null;

  form: FormGroup;

  btnDisabled = false;

  constructor(
    private activeModal: NgbActiveModal,
    private router: Router,
    private rest: RestApiService,
    private data: DataService,
    private fileUploader: UploadFileService,
    private builder: FormBuilder
  ) { }

  ngOnInit() {
    this.city.setValue(this.data.getPreferredCity());

    this.form = this.builder.group({
      'name': this.name,
      'description': this.description,
      'category': this.category,
      'address': this.address,
      'volume': this.volume,
      'minVolume': this.minVolume,
      'pricePerUnit': this.pricePerUnit,
      'measurementUnit': this.measurementUnit,
      'city': this.city,
      'date': this.date,
      'picturePath': this.picturePath,
      'payment': this.builder.group({
        'paymentType': this.paymentType,
        'paymentInfo': this.paymentInfo
      }, { validator: this.paymentValidator }),
      'isPrivate': this.isPrivate
    });
  }

  dismiss() {
    this.activeModal.close('dismissed');
  }

  get total(): number {
    const volume = Number.parseFloat(this.volume.value) || 0;
    const price = Number.parseFloat(this.pricePerUnit.value) || 0;
    return volume * price;
  }

  get today(): string {
    return this.data.currentDay;
  }

  paymentValidator(group: FormGroup) {
    const paymentType = group.controls['paymentType'].value;
    const paymentInfo = group.controls['paymentInfo'].value;

    if (paymentType !== 1) {
      return null;
    } else if (paymentType === 1 && !!paymentInfo) {
      return null;
    } else {
      return {
        infoMismatch: true
      };
    }
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
    this.pictureFile = null;
    this.picturePath.reset();
  }

  updateCategory(category: any) {
    this.category.setValue(category);
  }

  updateUnit(unit: any) {
    this.measurementUnit.setValue(unit);
  }

  updateCity(city: any) {
    this.city.setValue(city);
  }

  async createPurchase() {
    try {
      let pictureUrl;
      if (this.pictureUrl) {
        pictureUrl = await this.fileUploader.uploadImage(this.pictureFile);
      } else {
        pictureUrl = 'assets/img/box.svg'; // default picture's url
      }
      const {day, month, year} = this.date.value;

      const resp = await this.rest.addJointPurchase({
        name: this.name.value,
        picture: pictureUrl,
        description: this.description.value,
        category_id: this.category.value['_id'],
        address: this.address.value,
        city_id: this.city.value['_id'],
        volume: Number.parseFloat(this.volume.value),
        min_volume: Number.parseFloat(this.minVolume.value),
        price_per_unit: Number.parseFloat(this.pricePerUnit.value),
        measurement_unit_id: this.measurementUnit.value['_id'],
        date: new Date(year, month - 1, day),
        state: 0,
        payment_type: this.paymentType.value,
        payment_info: this.paymentInfo.value,
        is_public: !this.isPrivate.value
      });

      this
        .data
        .addToast('Закупка создана', '', 'success');

      const id = resp['data']['purchase']['_id'];

      await this
        .router
        .navigate(['/purchase', id]);

      this
        .activeModal
        .close();
    } catch (error) {
      const message = error.error.meta.message;
      this
        .data
        .addToast('Ошибка', message, 'error');
    }
  }
}
