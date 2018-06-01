import {Component, OnInit} from '@angular/core';

import {DataService} from '../data.service';

@Component({selector: 'app-profile', templateUrl: './profile.component.html', styleUrls: ['./profile.component.scss']})
export class ProfileComponent implements OnInit {
  profileSettingsHidden : boolean = true;
  ordersHidden : boolean = false;
  securityHidden : boolean = true;
  addressHidden : boolean = true;
  constructor(public data : DataService) {
    this
      .data
      .getProfile();
  }

  openProfileSettings()
  {
    this.profileSettingsHidden = false;
    this.ordersHidden = true;
    this.securityHidden = true;
    this.addressHidden = true;
  }

  openAddressSettings()
  {
    this.profileSettingsHidden = true;
    this.ordersHidden = true;
    this.securityHidden = true;
    this.addressHidden = false;
  }

  openSecuritySettings()
  {
    this.profileSettingsHidden = true;
    this.ordersHidden = true;
    this.securityHidden = false;
    this.addressHidden = true;
  }

  openOrders()
  {
    this.profileSettingsHidden = true;
    this.ordersHidden = false;
    this.securityHidden = true;
    this.addressHidden = true;
  }
  ngOnInit() {}

}
