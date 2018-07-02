import {Injectable} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {RestApiService} from './rest-api.service';
import {ToastData, ToastOptions, ToastyConfig, ToastyService} from 'ngx-toasty';


@Injectable({providedIn: 'root'})
export class DataService {
  message = '';

  user: any;
  stores: any;

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
      onRemove: (toast: ToastData) => {
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
    this.addToast('Ошибка', message, 'danger');
  }

  success(message) {
    this.addToast('Ура!', message, 'success');
  }

  warning(message) {
    this.addToast('Внимание', message, 'warning');
  }

  async getProfile() {
    try {
      if (localStorage.getItem('token')) {
        const data = await this
          .rest
          .getUserProfile();
        this.user = data['data'].user;

        if (this.user.isSeller) {
          const storeData = await this
            .rest
            .getUserStores();
          this.stores = storeData['data'].stores;
        }
      }
    } catch (error) {
      this.error(error);
    }
  }


}
