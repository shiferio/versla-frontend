import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RestApiService} from '../rest-api.service';

@Component({
  selector: 'app-good',
  templateUrl: './good.component.html',
  styleUrls: ['./good.component.scss']
})
export class GoodComponent implements OnInit {
  sub: any;

  good_id: number;

  info: any;

  constructor(
    private route: ActivatedRoute,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    this.sub = this.route.params.subscribe(async (params) => {
      this.good_id = params['good_id'];
      const resp = await this.rest.getGoodById(this.good_id);

      this.info = JSON.stringify(resp['data']['good']);
    });
  }

}
