import {Injectable} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {RestApiService} from './rest-api.service';
import {ToastData, ToastOptions, ToastyConfig, ToastyService} from 'ngx-toasty';
import {Observable, Subject, Subscription} from 'rxjs';

const API_URL = 'http://api.versla.ru';


@Injectable({providedIn: 'root'})
export class DataService {
  message = '';
  messageType = 'danger';

  user: any;
  stores: any;

  onCartChanged: Subject<any>;

  constructor(private router: Router, private rest: RestApiService, private toastyService: ToastyService,
              private toastyConfig: ToastyConfig) {
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
    this.onCartChanged = new Subject<any>();
  }

  async updateCart() {
    if (localStorage.getItem('token')) {
      await this
        .rest
        .updateCart({
          cart: this.user.cart
        });
    } else {
      localStorage.setItem('cart', JSON.stringify({
        cart: this.user.cart
      }));
    }

    this.onCartChanged.next({
      cartSize: this.user.cart.length
    });
  }

  async addGoodToCart(good_id: any, quantity: any) {
    quantity = Number.parseInt(quantity || 1);
    good_id = Number.parseInt(good_id);

    if (!this.user.cart) {
      this.user.cart = [];
    }

    const index = this.user.cart.findIndex(good => good.good_id === good_id);
    if (index === -1) {
      this.user.cart.push({
        good_id: good_id,
        quantity: quantity
      });
    } else {
     this.user.cart[index].quantity += quantity;
    }

    await this.updateCart();
  }

  async deleteGoodFromCart(good_id: any) {
    good_id = Number.parseInt(good_id);

    const index = this.user.cart.findIndex(good => good.good_id === good_id);
    if (index !== -1) {
      this.user.cart.splice(index, 1);
      await this.updateCart();
    }
  }

  async getCart() {
    if (localStorage.getItem('token')) {
      await this
        .getProfile();
      if (!this.user.cart) {
        this.user.cart = [];
      }
    } else {
      const local = localStorage.getItem('cart');
      if (local) {
        this.user.cart = JSON.parse(local);
      } else {
        this.user.cart = [];
      }
    }

    return this.user.cart;
  }

  addToast(title: string, message: string, type: string) {
    const toastOptions: ToastOptions = {
      title: title,
      msg: message,
      showClose: true,
      timeout: 5000,
      theme: 'bootstrap',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        console.log('Toast ' + toast.id + ' has been removed!');
      }
    };
    switch (type) {
      case 'info':
        this.toastyService.info(toastOptions);
        break;
      case 'success':
        this.toastyService.success(toastOptions);
        break;
      case 'wait':
        this.toastyService.wait(toastOptions);
        break;
      case 'error':
        this.toastyService.error(toastOptions);
        break;
      case 'warning':
        this.toastyService.warning(toastOptions);
        break;
    }


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
        // console.log(data['data'].user);
        if (this.user.isSeller) {
          const storeData = await this
            .rest
            .get(`${API_URL}/api/accounts/stores`);
          this.stores = storeData['data'].stores;
          // console.log(this.stores);
        }
      }
    } catch (error) {
      this.error(error);
    }
  }


}
