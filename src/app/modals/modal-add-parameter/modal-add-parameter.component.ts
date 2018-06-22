import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';

@Component({
  selector: 'app-modal-add-parameter',
  templateUrl: './modal-add-parameter.component.html',
  styleUrls: ['./modal-add-parameter.component.scss']
})
export class ModalAddParameterComponent implements OnInit {

  good_id: number;

  available_params: Array<any>;

  name = '';

  btnDisabled = false;

  values = [];

  constructor(
    public activeModal: NgbActiveModal,
    private data: DataService,
    private rest: RestApiService
  ) {
  }

  ngOnInit() {
    this.values.push({
      value: ''
    });
  }

  validate(): boolean {
    if (this.name) {
      const i = this.available_params.findIndex(param => param.name === this.name);
      if (i !== -1) {
        this
          .data
          .addToast('Ошибка', 'Параметр с таким названием уже существует', 'error');
        return false;
      } else {
        if (this.values.every(value => value.value === '')) {
          this
            .data
            .addToast('Ошибка', 'Введите хотя бы одно значение', 'error');
          return false;
        } else {
          return true;
        }
      }
    } else {
      this
        .data
        .addToast('Ошибка', 'Введите название параметра', 'error');
      return false;
    }
  }

  async createParam() {
    this.btnDisabled = true;

    if (this.validate()) {
      const values = this
        .values
        .map(value => value.value)
        .filter(value => value !== '');
      const new_params = this.available_params.slice();
      new_params.push({
        name: this.name,
        values: values
      });

      try {
        const resp = await this.rest.updateGoodInfo(this.good_id, 'params', {
          good_id: this.good_id,
          params: new_params
        });

        if (resp['meta'].success) {
          this
            .data
            .addToast(resp['meta'].message, '', 'success');

          this.activeModal.close();
        } else {
          this
            .data
            .addToast(resp['meta'].message, '', 'error');
        }
      } catch (error) {
        this
          .data
          .addToast(error['message'], '', 'error');
      }
    }

    this.btnDisabled = false;
  }

  updateValuesCount() {
    const len = this.values.length;

    if (len > 1) {
      const last = this.values[len - 1];
      const beforeLast = this.values[len - 2];

      if (last.value === '' && beforeLast.value === '') {
        this.values.splice(len - 1, 1);
      } else if (last.value !== '' && beforeLast.value !== '') {
        this.values.push({
          value: ''
        });
      }
    } else if (this.values[len - 1].value !== '') {
      this.values.push({
        value: ''
      });
    }
  }
}
