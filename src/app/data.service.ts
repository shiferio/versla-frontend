import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { RestApiService } from './rest-api.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  message = '';
  messageType = 'danger';

  user: any;

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
          .get('http://88.198.148.140:38925/api/buyer/v1/profile');
        this.user = {
          id: data['id'],
          email: data['email'],
          first_name: data['first_name'],
          last_name: data['last_name'],
          phone: data['phone'],
          avatar_url: data['avatar_url']
        };
      }
    } catch (error) {
      this.error(error);
    }
  }
}
