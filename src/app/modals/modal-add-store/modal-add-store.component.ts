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
          .data
          .error('Вы не ввели ссылку!');
      }
    } else {
      this
        .data
        .error('Вы не ввели название магазина!');
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
            .data
            .success(data['meta'].message);
          this.router.navigate(['/store', this.link]);
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
