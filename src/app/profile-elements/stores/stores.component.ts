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
  }

  addNewStore() {
    const modalRef = this.modalService.open(ModalAddStoreComponent);

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  openStore(storeLink: string) {
    this.router.navigate(['/store', storeLink]);
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
          .data
          .success(data['meta'].message);
      } else {
        this
          .data
          .error(data['meta'].message);
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
    this.btnDeleteDisabled = false;
  }

}
