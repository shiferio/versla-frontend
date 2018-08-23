import {Component, OnInit} from '@angular/core';
import {RestApiService} from '../../rest-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '../../data.service';

@Component({
  selector: 'app-modal-edit-store-contacts',
  templateUrl: './modal-edit-store-contacts.component.html',
  styleUrls: ['./modal-edit-store-contacts.component.scss']
})
export class ModalEditStoreContactsComponent implements OnInit {

  info: any;

  contacts: any;

  phone: string;

  email: string;

  address: string;

  link: string;

  city: any;

  btnDisabled = false;

  constructor(
    public activeModal: NgbActiveModal,
    private rest: RestApiService,
    private data: DataService) {
  }

  ngOnInit() {
    this.phone = this.contacts.phone;
    this.email = this.contacts.email;
    this.address = this.contacts.address;
  }

  closeModal() {
    this
      .activeModal
      .close();
  }

  validate() {
    if (!this.phone) {
      this
        .data
        .error('Введите номер телефона');
      return false;
    }

    if (!this.email) {
      this
        .data
        .error('Введите e-mail');
      return false;
    }

    if (!this.address) {
      this
        .data
        .error('Введите адрес');
      return false;
    }

    if (!this.city) {
      this
        .data
        .error('Выберите город');
      return false;
    }

    return true;
  }

  onCityChanged(city: any) {
    this.city = city;
  }

  async updateInfo() {
    this.btnDisabled = true;

    try {
      if (this.validate()) {
        await this.rest.updateStoreInfo(this.link, 'contacts', {
          link: this.link,
          email: this.email,
          phone: this.phone,
          address: this.address,
          city: this.city['_id']
        });

        this.closeModal();
        this
          .data
          .success('Данные обновлены');
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
    }

    this.btnDisabled = false;
  }

}
