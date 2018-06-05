import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';


const API_URL = 'http://192.168.43.100:3030';

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
  }

  async register() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this
          .rest
          .post(`${API_URL}/api/accounts/signup`, {
            login: this.login,
            email: this.email,
            password: this.password
          });
        if (data['meta'].success) {
          this
            .data
            .success(data['meta'].message);
          this
            .router
            .navigate(['/']);
        } else {
          this
            .data
            .error(data['meta'].message);
        }
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
    this.btnDisabled = false;
  }

}
