import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-registration',
  templateUrl: './modal-registration.component.html',
  styleUrls: ['./modal-registration.component.scss']
})
export class ModalRegistrationComponent implements OnInit {

  login = new FormControl('', Validators.required);

  email = new FormControl('', Validators.required);

  phone = new FormControl('', Validators.required);

  password = new FormControl('', Validators.required);

  confirmation = new FormControl('', Validators.required);

  city: FormControl;

  error: string;

  form: FormGroup;

  submitDisabled = false;

  passwordForm = this.builder.group({
    'password': this.password,
    'confirmation': this.confirmation
  }, { validator: this.passwordMatch });

  constructor(
    private router: Router,
    public data: DataService,
    private rest: RestApiService,
    private builder: FormBuilder,
    private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.city = new FormControl(this.data.getPreferredCity(), Validators.required);

    this.form = this.builder.group({
      'login': this.login,
      'email': this.email,
      'phone': this.phone,
      'city': this.city,
      'passwords': this.passwordForm
    });
  }

  passwordMatch(group: FormGroup) {
    const password = group.controls['password'].value;
    const confirmation = group.controls['confirmation'].value;

    if (password === confirmation) {
      return null;
    } else {
      return {
        passwordMismatch: true
      };
    }
  }

  close() {
    this.activeModal.dismiss();
  }

  async register() {
    this.submitDisabled = true;

    try {
        await this
          .rest
          .signupUser({
            login: this.login.value,
            email: this.email.value,
            phone: this.phone.value,
            city: this.city.value['_id'],
            password: this.password.value
          });

        this
          .data
          .addToast('Вы успешно зарегистрированы', '', 'success');

        await this
          .router
          .navigate(['/']);

        this
          .activeModal
          .close();
    } catch (error) {
      const message = error.error.meta.message;

      if (message === 'EMAIL ALREADY EXISTS') {
        this
          .data
          .addToast('Пользователь с таким e-mail уже существует', '', 'error');
      } else if (message === 'PHONE ALREADY EXISTS') {
        this
          .data
          .addToast('Пользователь с таким телефоном уже существует', '', 'error');
      }
    }

    this.submitDisabled = false;
  }

}
