import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.scss']
})
export class ModalLoginComponent implements OnInit {

  phone = new FormControl('', Validators.required);

  password = new FormControl('', Validators.required);

  form: FormGroup;

  submitDisabled = false;

  error: string;

  constructor(
    private activeModal: NgbActiveModal,
    private router: Router,
    private rest: RestApiService,
    private data: DataService,
    private builder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.builder.group({
      'phone': this.phone,
      'password': this.password
    });
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  get phoneErrors(): boolean {
    return !!this.phone.errors || this.error === 'NO SUCH USER';
  }

  get passwordErrors(): boolean {
    return !!this.password.errors || this.error === 'PASSWORD MISMATCH';
  }

  async onEnter() {
    if (this.form.valid && !this.submitDisabled) {
      await this.login();
    }
  }

  async login() {
    this.submitDisabled = true;
    this.error = null;

    try {
        const resp = await this
          .rest
          .loginUser({
            phone: this.phone.value,
            password: this.password.value
          });

          localStorage.setItem('token', resp['data'].token);

          await this
            .data
            .getProfile();

          await this
            .router
            .navigate(['/']);

          this
            .data
            .addToast('Вы успешно авторизованы', '', 'success');

          this
            .activeModal
            .close();
    } catch (error) {
      this.error = error.error.meta.message;
    }

    this.submitDisabled = false;
  }
}
