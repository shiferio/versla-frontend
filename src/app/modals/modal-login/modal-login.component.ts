import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';

@Component({selector: 'app-modal-login', templateUrl: './modal-login.component.html', styleUrls: ['./modal-login.component.scss']})
export class ModalLoginComponent implements OnInit {

  email = '';
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
    if (this.email) {
      if (this.password) {
        return true;
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
  }

  async login() {
    this.btnDisabled = true;

    try {
      if (this.validate()) {
        const data = await this
          .rest
          .post('http://localhost:3030/api/accounts/login', {
            email: this.email,
            password: this.password
          });
        if (data['meta'].success) {
          localStorage.setItem('token', data['data'].token);
          await this
            .data
            .getProfile();
          this
            .router
            .navigate(['/']);
          this.data.message = null;
          this
            .activeModal
            .close();
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
