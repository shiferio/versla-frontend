import {Component, OnInit} from '@angular/core';

import {DataService} from '../../data.service';
import {Router, NavigationEnd} from '@angular/router';

@Component({selector: 'app-profile', templateUrl: './profile.component.html', styleUrls: ['./profile.component.scss']})
export class ProfileComponent implements OnInit {
  tabNum = 1;

  constructor(public data: DataService, private router: Router) {
    this
      .data
      .getProfile();

    router
      .events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (event.url.includes('orders')) {
            this.tabNum = 1;
          } else if (event.url.includes('settings')) {
            this.tabNum = 2;
          } else if (event.url.includes('security')) {
            this.tabNum = 3;
          } else if (event.url.includes('address')) {
            this.tabNum = 4;
          }
        }
      });
  }

  setTab(tabNum) {
    this.tabNum = tabNum;
  }

  isTabSet(tabNum) {
    return this.tabNum === tabNum;
  }

  ngOnInit() {
  }

}
