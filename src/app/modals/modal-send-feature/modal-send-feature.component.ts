import { Component, OnInit } from '@angular/core';
import {DataService} from '../../data.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {RestApiService} from '../../rest-api.service';

@Component({
  selector: 'app-modal-send-feature',
  templateUrl: './modal-send-feature.component.html',
  styleUrls: ['./modal-send-feature.component.scss']
})
export class ModalSendFeatureComponent implements OnInit {
  email = '';
  text = '';
  btnDisabled = false;
  constructor(public activeModal: NgbActiveModal, private router: Router, private rest: RestApiService, private data: DataService) { }

  ngOnInit() {
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


  async sendFeature() {
    this.btnDisabled = true;

    try {
      if (this.validate()) {
        const data = await this
          .rest
          .sendFeature({
            email: this.email,
            text: this.text
          });
        if (data['meta'].success) {
          this
            .data.addToast('Вы успешно оставили пожелания по функционалу! Спасибо', '', 'success');

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
