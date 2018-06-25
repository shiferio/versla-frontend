import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-unavailable-goods',
  templateUrl: './modal-unavailable-goods.component.html',
  styleUrls: ['./modal-unavailable-goods.component.scss']
})
export class ModalUnavailableGoodsComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }
}
