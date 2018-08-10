import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-modal-send-error',
  templateUrl: './modal-send-error.component.html',
  styleUrls: ['./modal-send-error.component.scss']
})
export class ModalSendErrorComponent implements OnInit {
  email = '';
  text = '';
  btnDisabled = false;
  constructor(public activeModal: NgbActiveModal, private router: Router, private rest: RestApiService, private data: DataService) { }

  ngOnInit() {
  }

  closeModal() {
    this
      .activeModal
      .close('Modal closed');
  }

  validate() {
    if (this.email) {
      if (this.text) {
        return true;
      } else {
        this
          .data.addToast('Ошибка', 'Вы не ввели текст сообщения!', 'error');
      }
    } else {
      this
        .data.addToast('Ошибка', 'Вы не ввели email!', 'error');
    }
  }


  async sendError() {
    this.btnDisabled = true;

    try {
      if (this.validate()) {
        const data = await this
          .rest
          .sendError({
            email: this.email,
            text: this.text
          });
        if (data['meta'].success) {
          this
            .data.addToast('Вы успешно отправили сообщение об ошибке! Спасибо', '', 'success');

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
