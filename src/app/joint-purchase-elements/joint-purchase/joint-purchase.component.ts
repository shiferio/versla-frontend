import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {CartService} from '../../cart.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SearchService} from '../../search.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-joint-purchase',
  templateUrl: './joint-purchase.component.html',
  styleUrls: ['./joint-purchase.component.scss']
})
export class JointPurchaseComponent implements OnInit {

  private route_sub: Subscription;

  purchase_id: string;

  purchase_info: any = {};

  constructor(
    private route: ActivatedRoute,
    private rest: RestApiService,
    private data: DataService,
    private cart: CartService,
    private modalService: NgbModal,
    private search: SearchService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();

    this.route_sub = this.route.params.subscribe(async (params) => {
      this.purchase_id = params['purchase_id'];

      await this.getPurchaseInfo();

      this.spinner.hide();
    });
  }

  async getPurchaseInfo() {
    const resp = await this.rest.getJointPurchaseById(this.purchase_id);
    this.purchase_info = resp['data']['purchase'];
  }

}
