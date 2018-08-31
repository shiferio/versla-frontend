import {Component, Input, OnInit} from '@angular/core';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {stringify} from 'querystring';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-modal-good-purchase-chooser',
  templateUrl: './modal-good-purchase-chooser.component.html',
  styleUrls: ['./modal-good-purchase-chooser.component.scss']
})
export class ModalGoodPurchaseChooserComponent implements OnInit {

  @Input('good')
  good: any;

  purchases: Array<any>;

  city: any;

  ready = false;

  constructor(
    private rest: RestApiService,
    private data: DataService,
    private activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.city = this.data.getPreferredCity();
    await this.fetchPurchases();

    this.route.params.subscribe(url => {
      console.log(url);
    });
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  get noResults(): boolean {
    return this.purchases.length === 0;
  }

  async cityChanged(city: any) {
    this.city = city;
    await this.fetchPurchases();
  }

  async fetchPurchases() {
    try {
      this.ready = false;

      const resp = await this.rest.searchGoodJointPurchases(stringify({
        good_id: this.good['_id'],
        city_id: this.city['_id']
      }));

      this.purchases = resp['data'];

      this.ready = true;
    } catch (error) {
      this
        .data
        .error('Не удалось загрузить закупки');
    }
  }

  async openPurchase(id: string) {
    await this.router.navigate(['/purchase', id]);
    this.activeModal.close();
  }

}
