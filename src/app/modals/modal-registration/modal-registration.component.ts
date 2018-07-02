import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';


@Component({
  selector: 'app-registration',
  templateUrl: './modal-registration.component.html',
  styleUrls: ['./modal-registration.component.scss']
})
export class ModalRegistrationComponent implements OnInit {

  login = '';
  email = '';
  password = '';
  password_confirmation = '';
  btnDisabled = false;

  constructor(private router: Router, private data: DataService, private rest: RestApiService, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  validate() {
    if (this.login) {
      if (this.email) {
        if (this.password) {
          if (this.password_confirmation) {
            if (this.password === this.password_confirmation) {
              return true;
            } else {
              this
                .data
                .error('Passwords don\'t match.');
            }
          } else {
            this
              .data
              .error('Confirmation password is not entered.');
          }
        } else {
          this
            .data
            .error('Password is not entered.');
        }
      } else {
        this
          .data
          .error('Email is not entered.');
      }
    } else {
      this
        .data
        .error('Login is not entered.');
    }

    return false;
  }

  async register() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this
          .rest
          .signupUser({
            login: this.login,
            email: this.email,
            password: this.password
          });
        if (data['meta'].success) {
          this
            .data.addToast('Вы успешно зарегистрированы', data['meta'].message, 'success');
          this
            .router
            .navigate(['/']);
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
