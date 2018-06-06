import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RestApiService} from '../../rest-api.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  link: string;
  info: string;
  private sub: any;

  constructor(private route: ActivatedRoute, private rest: RestApiService) {
  }

  async getStoreInfo(storeLink: string) {
    const storeInfo = await this.rest.getStore(storeLink);
    if (storeInfo['meta'].success) {
      this.info = JSON.stringify(storeInfo['data'].store);
    }
  }
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.link = params['link'];
      this.getStoreInfo(this.link);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
