import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';


@Component({selector: 'app-modal-login', templateUrl: './modal-login.component.html', styleUrls: ['./modal-login.component.scss']})
export class ModalLoginComponent implements OnInit {
  phone = '';
  password = '';
  btnDisabled = false;

  constructor(public activeModal: NgbActiveModal, private router: Router, private rest: RestApiService, private data: DataService) {
  }

  ngOnInit() {
  }

  closeModal() {
    this
      .activeModal
      .close('Modal closed');
  }

  validate() {
    if (this.phone) {
      if (this.password) {
        return true;
      } else {
        this
          .data.addToast('Ошибка', 'Вы не ввели пароль!', 'error');
      }
    } else {
      this
        .data.addToast('Ошибка', 'Вы не ввели номер телефона!', 'error');
    }
  }

  async login() {
    this.btnDisabled = true;

    try {
      if (this.validate()) {
        const data = await this
          .rest
          .loginUser({
            phone: this.phone,
            password: this.password
          });
        if (data['meta'].success) {
          localStorage.setItem('token', data['data'].token);

          await this
            .data
            .getProfile();

          await this
            .router
            .navigate(['/']);

          this
            .data.addToast('Вы успешно авторизованы', data['meta'].message, 'success');

          this
            .activeModal
            .close();
        } else {
          this
            .data.addToast('Ошибка', data['meta'].message, 'error');
        }
      }
    } catch (error) {
      this
        .data.addToast('Ошибка', error['message'], 'error');
    }
    this.btnDisabled = false;
  }
}
