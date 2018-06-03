import {Component, OnInit} from '@angular/core';
import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddStoreComponent} from '../../modals/modal-add-store/modal-add-store.component';

@Component({selector: 'app-stores', templateUrl: './stores.component.html', styleUrls: ['./stores.component.scss']})
export class StoresComponent implements OnInit {

  constructor(public data: DataService, private rest: RestApiService, private modalService: NgbModal) {
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

}
