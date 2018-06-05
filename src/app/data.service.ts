import {Injectable} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {RestApiService} from './rest-api.service';

const API_URL = 'http://192.168.43.100:3030';


@Injectable({providedIn: 'root'})
export class DataService {
  message = '';
  messageType = 'danger';

  user: any;
  stores: any;

  constructor(private router: Router, private rest: RestApiService) {
    this
      .router
      .events
      .subscribe(event => {
        this
          .router
          .events
          .subscribe(event2 => {
            if (event2 instanceof NavigationStart) {
              this.message = '';
            }
          });
      });
  }

  error(message) {
    this.messageType = 'danger';
    this.message = message;
  }

  success(message) {
    this.messageType = 'success';
    this.message = message;
  }

  warning(message) {
    this.messageType = 'warning';
    this.message = message;
  }

  async getProfile() {
    try {
      if (localStorage.getItem('token')) {
        const data = await this
          .rest
          .get(`${API_URL}/api/accounts/profile`);
        this.user = data['data'].user;

        if (this.user.isSeller) {
          const storeData = await this
            .rest
            .get(`${API_URL}/api/accounts/stores`);
          this.stores = storeData['data'].stores;
          console.log(this.stores);
        }
      }
    } catch (error) {
      this.error(error);
    }
  }
}
