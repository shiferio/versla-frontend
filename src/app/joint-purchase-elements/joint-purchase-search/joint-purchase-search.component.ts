import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {ModalAddJointPurchaseComponent} from '../../modals/modal-add-joint-purchase/modal-add-joint-purchase.component';
import {ActivatedRoute, Router} from '@angular/router';
import {JointPurchaseSearchService} from '../../joint-purchase-search.service';
import {stringify} from 'querystring';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-joint-purchase-search',
  templateUrl: './joint-purchase-search.component.html',
  styleUrls: ['./joint-purchase-search.component.scss']
})
export class JointPurchaseSearchComponent implements OnInit, OnDestroy {

  private resultSub: Subscription;

  private queryParamsSub: Subscription;

  purchases = [];

  categories = [];

  category = {};

  default_category = {
    all: true,
    name: 'Все'
  };

  page_size = 4;

  page_number = 1;

  total = 0;

  pricing = [10, 1000];

  volume = 0;

  minVolume = 0;

  constructor(
    private search: JointPurchaseSearchService,
    private rest: RestApiService,
    private data: DataService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.initialize();

    this.resultSub = this.search.result.subscribe(data => {
      this.purchases = data['purchases'];
      this.total = data['total'];
    });

    this.queryParamsSub = this.route.queryParamMap.subscribe(async () => {
      this.search.url = this.router.url;

      const query = this.search.query;
      const filter = stringify(this.search.filter);
      const page_number = this.search.page_number;

      await this.loadFilters();
      this.search.invoke(query, filter, page_number, this.page_size);
    });
  }

  ngOnDestroy() {
    this.resultSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
    this.search.reset();
    this.purchases = [];
    this.total = 0;
  }

  async initialize() {
    this.purchases = [];
    this.total = 0;
    await this.loadCategories();
  }

  async loadFilters() {
    const categoryIndex = this
      .categories
      .findIndex(category => category['_id'] === this.search.category['_id']);
    this.category = this.categories[categoryIndex >= 0 ? categoryIndex : 0];

    this.page_number = this.search.page_number;

    this.volume = this.search.volume;

    this.minVolume = this.search.min_volume;

    this.pricing = [
      this.search.pricing['min'] || 10,
      this.search.pricing['max'] || 1000
    ];
  }

  resetPagination() {
    this.page_number = 1;
    this.search.page_number = this.page_number;
  }

  get noResults(): boolean {
    return this.purchases.length === 0;
  }

  get loading(): boolean {
    return this.purchases === null && this.purchases === undefined;
  }

  async loadCategories() {
    const resp = await this.rest.getAllGoodCategories();
    const categories = resp['data']['categories'];
    categories.splice(0, 0, this.default_category);
    this.categories = categories;
  }

  async filterByCategory() {
    if (this.category) {
      if (this.category['all']) {
        this.search.category = null;
      } else {
        this.search.category = this.category;
      }
    }

    this.resetPagination();
    this.search.navigate();
  }

  moveToPage() {
    this.search.page_number = this.page_number;
    this.search.navigate();
  }

  filterByPrice() {
    this.search.pricing = {
      min: this.pricing[0],
      max: this.pricing[1]
    };

    this.resetPagination();
    this.search.navigate();
  }

  priceChanged() {
    this.pricing = [this.pricing[0], this.pricing[1]];
    this.filterByPrice();
  }

  resetFilters() {
    this.resetPagination();
    this.search.reset();
    this.search.navigate();
  }

  openAddJointPurchase() {
    const modalRef = this.modalService.open(
      ModalAddJointPurchaseComponent,
      {
        size: 'lg'
      }
    );

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

}
