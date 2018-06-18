import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-good',
  templateUrl: './good.component.html',
  styleUrls: ['./good.component.scss']
})
export class GoodComponent implements OnInit {
  sub: any;

  good_id: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.sub = this.route.params.subscribe(async (params) => {
      this.good_id = params['good_id'];
    });
  }

}
