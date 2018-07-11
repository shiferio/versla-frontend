import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {RestApiService} from '../rest-api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-store-card',
  templateUrl: './store-card.component.html',
  styleUrls: ['./store-card.component.scss']
})
export class StoreCardComponent implements OnInit {
  @Input('store')
  store: any;

  constructor(private data: DataService,
              private rest: RestApiService,
              private router: Router) { }

  async ngOnInit() {
  }

  get isCreator(): boolean {
    if (this.data.user && this.store.creator_id) {
      return this.data.user._id === this.store.creator_id;
    } else {
      return false;
    }
  }

  async openStore(link: string) {
    await this
      .router
      .navigate(['/store', link]);
  }

}
