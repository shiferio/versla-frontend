import { Component, OnInit } from '@angular/core';

import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  address: any = {
    addr1: '',
    addr2: '',
    city: '',
    country: '',
    postalCode: ''
  };

  constructor(private rest: RestApiService, private data: DataService) { }

  ngOnInit() {
    Object.assign(this.address, this.data.user.address);
    this.data.setTitle('Адрес - Профиль');
  }

  validate(): boolean {
    const re = /^\d+$/;
    if (this.address.postalCode.trim().match(re)) {
      return true;
    } else {
      this
        .data
        .error('Invalid postal code');
    }

    return false;
  }

  async update() {
    try {
      if (this.validate()) {
        const data = await this.rest.updateAddress({
          addr1: this.address.addr1,
          addr2: this.address.addr2,
          city: this.address.city,
          country: this.address.country,
          postalCode: this.address.postalCode
        });

        if (data['meta'].success) {
          this
            .data
            .success(data['meta'].message);
        } else {
          this
            .data
            .error(data['meta'].message);
        }
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

}
