import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-modal-add-store',
  templateUrl: './modal-add-store.component.html',
  styleUrls: ['./modal-add-store.component.scss']
})
export class ModalAddStoreComponent implements OnInit {

  name = new FormControl('', Validators.required);

  link = new FormControl('', Validators.compose([
    Validators.required, Validators.maxLength(10)
  ]));

  goods_type = new FormControl('retail', Validators.required);

  bank_type = new FormControl('card', Validators.required);

  bank_num = new FormControl('', Validators.required);

  resident_type = new FormControl('individual', Validators.required);

  tax_num = new FormControl('', Validators.required);

  state_num = new FormControl('', Validators.maxLength(13));

  city = new FormControl(null, Validators.required);

  category = new FormControl(null, Validators.required);

  btnDisabled = false;

  form: FormGroup;

  residentForm: FormGroup;

  bankForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private rest: RestApiService,
    private data: DataService,
    private builder: FormBuilder
  ) { }

  ngOnInit() {
    this.residentForm = this.builder.group({
      'resident_type': this.resident_type,
      'tax_num': this.tax_num,
      'state_num': this.state_num,
    }, {
      validator: Validators.compose([
        this.stateNumValidate, this.taxNumValidate
      ])
    });

    this.bankForm = this.builder.group({
      'bank_type': this.bank_type,
      'bank_num': this.bank_num,
    }, {
      validator: this.bankNumValidate
    });

    this.form = this.builder.group({
      'name': this.name,
      'link': this.link,
      'goods_type': this.goods_type,
      'resident': this.residentForm,
      'bank': this.bankForm,
      'city': this.city,
      'category': this.category
    });
  }

  stateNumValidate(group: FormGroup) {
    const residentType = group.controls['resident_type'].value;
    const stateNum = group.controls['state_num'].value;

    if (residentType === 'entity') {
      if (!stateNum) {
        group.controls['state_num'].setErrors({
          stateNumRequired: true
        });
      } else if (stateNum.length !== 13) {
        group.controls['state_num'].setErrors({
          stateNumMismatch: true
        });
      }
    }

    return null;
  }

  taxNumValidate(group: FormGroup) {
    const residentType = group.controls['resident_type'].value;
    const taxNum = group.controls['tax_num'].value;

    if (residentType === 'entity' && taxNum.length === 10 ||
      residentType === 'individual' && taxNum.length === 12 ||
      taxNum.length === 0
    ) {
    } else {
      group.controls['tax_num'].setErrors({
        taxNumMismatch: true
      });
    }

    return null;
  }

  bankNumValidate(group: FormGroup) {
    const bankType = group.controls['bank_type'].value;
    const bankNum = group.controls['bank_num'].value;

    if (bankType === 'card' && bankNum.length === 16 ||
      bankType === 'num' && bankNum.length === 20 ||
      bankNum.length === 0
    ) {
    } else {
      group.controls['bank_num'].setErrors({
        bankNumMismatch: true
      });
    }

    return null;
  }

  updateCategory(category: any) {
    this.category.setValue(category);
  }

  updateCity(city: any) {
    this.city.setValue(city);
  }

  async createStore() {
    this.btnDisabled = true;

    try {
      await this
        .rest
        .createStore({
          name: this.name.value,
          link: this.link.value,
          tax_num: this.tax_num.value,
          state_num: this.state_num.value,
          bank_type: this.bank_type.value,
          bank_num: this.bank_num.value,
          resident_type: this.resident_type.value,
          goods_type: this.goods_type.value,
          city: this.city.value['_id'],
          category: this.category.value['_id']
        });

      await this
        .data
        .getProfile();
      this
        .activeModal
        .close();
      this
        .data
        .addToast('Магазин успешно добавлен', '', 'success');

      await this
        .router
        .navigate(['/store', this.link.value]);
    } catch (error) {
      const message = error.error.meta.message;
      this
        .data
        .addToast('Ошибка', message, 'error');
    }
    this.btnDisabled = false;
  }
}
