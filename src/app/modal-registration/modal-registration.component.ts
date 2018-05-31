import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';


@Component({
  selector: 'app-registration',
  templateUrl: './modal-registration.component.html',
  styleUrls: ['./modal-registration.component.scss']
})
export class ModalRegistrationComponent implements OnInit {

  name = '';
  email = '';
  password = '';
  password_confirmation = '';
  btnDisabled = false;

  constructor(
    private router: Router,
    private data: DataService,
    private rest: RestApiService,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  validate() {
    if (this.name) {
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
        .error('Name is not entered.');
    }
  }

  async register() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this
          .rest
          .post('http://88.198.148.140:38925/api/buyer/v1/register', {
            user: {
              email: this.email,
              password: this.password,
              password_confirmation: this.password_confirmation
            }
          });
        if (data['id']) {
          this
            .data
            .success('Registration successful!');
          this
            .router
            .navigate(['/']);
          this.activeModal.close();
        } else {
          this
            .data
            .error(data['message']);
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
