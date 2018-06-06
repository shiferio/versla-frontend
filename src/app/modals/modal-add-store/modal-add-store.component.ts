import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-modal-add-store',
  templateUrl: './modal-add-store.component.html',
  styleUrls: ['./modal-add-store.component.scss']
})
export class ModalAddStoreComponent implements OnInit {

  name = '';
  link = '';
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
    if (this.name) {
      if (this.link) {
        return true;
      } else {
        this
          .data.addToast('Ошибка', 'Вы не ввели ссылку!', 'error');
      }
    } else {
      this
        .data.addToast('Ошибка', 'Вы не ввели название магазина!', 'error');
    }
  }

  async createStore() {
    this.btnDisabled = true;

    try {
      if (this.validate()) {
        const data = await this
          .rest
          .createStore({
            name: this.name,
            link: this.link
          });
        if (data['meta'].success) {
          await this
            .data
            .getProfile();
          this.closeModal();
          this
            .data.addToast('Магазин успешно добавлен', data['meta'].message, 'success');

          this.router.navigate(['/store', this.link]);
        } else {
          this
            .data.addToast('Ошибка', data['meta'].message, 'error');
        }
      }
    } catch (error) {
      this
        .data.addToast('Ошибка', error['messsage'], 'error');
    }
    this.btnDisabled = false;
  }
}
