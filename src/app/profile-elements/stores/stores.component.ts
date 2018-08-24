import {Component, OnInit} from '@angular/core';
import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddStoreComponent} from '../../modals/modal-add-store/modal-add-store.component';
import {Router} from '@angular/router';

@Component({selector: 'app-stores', templateUrl: './stores.component.html', styleUrls: ['./stores.component.scss']})
export class StoresComponent implements OnInit {
  btnDeleteDisabled = false;

  constructor(public data: DataService, private rest: RestApiService, private modalService: NgbModal, private router: Router) {
  }

  ngOnInit() {
    this.data.setTitle('Мои магазины - Профиль');
  }

  addNewStore() {
    const modalRef = this.modalService.open(ModalAddStoreComponent);

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  async openStore(storeLink: string) {
    await this
      .router
      .navigate(['/store', storeLink]);
  }
  async deleteStore(storelink: string) {
    this.btnDeleteDisabled = true;

    try {
      const data = await this
        .rest
        .deleteStore(storelink);
      if (data['meta'].success) {
        await this
          .data
          .getProfile();
        this
          .data.addToast('Магазин успешно удален', data['meta'].message, 'success');

      } else {
        this
          .data.addToast('Ошибка', data['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data.addToast('Ошибка', error['message'], 'error');
    }
    this.btnDeleteDisabled = false;
  }
}
