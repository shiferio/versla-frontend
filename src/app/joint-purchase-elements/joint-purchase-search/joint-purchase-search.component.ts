import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {ModalAddJointPurchaseComponent} from '../../modals/modal-add-joint-purchase/modal-add-joint-purchase.component';

@Component({
  selector: 'app-joint-purchase-search',
  templateUrl: './joint-purchase-search.component.html',
  styleUrls: ['./joint-purchase-search.component.scss']
})
export class JointPurchaseSearchComponent implements OnInit {

  constructor(
    private rest: RestApiService,
    private data: DataService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  openAddJointPurchase() {
    const modalRef = this.modalService.open(ModalAddJointPurchaseComponent);

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

}
