import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-delete-good',
  templateUrl: './modal-delete-good.component.html',
  styleUrls: ['./modal-delete-good.component.scss']
})
export class ModalDeleteGoodComponent implements OnInit {

  name: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
