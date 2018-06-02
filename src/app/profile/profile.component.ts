import {Component, OnInit} from '@angular/core';

import {DataService} from '../data.service';

@Component({selector: 'app-profile', templateUrl: './profile.component.html', styleUrls: ['./profile.component.scss']})
export class ProfileComponent implements OnInit {
  tabNum : number = 1;

  constructor(public data : DataService) {
    this
      .data
      .getProfile();
  }

  setTab(tabNum) {
    this.tabNum = tabNum;
  }

  isTabSet(tabNum) {
    return this.tabNum === tabNum;
  }
  ngOnInit() {}

}
