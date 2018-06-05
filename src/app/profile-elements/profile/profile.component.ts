import {Component, OnInit} from '@angular/core';

import {DataService} from '../../data.service';
import {Router, NavigationEnd} from '@angular/router';
import {FileHolder} from 'angular2-image-upload';
import {RestApiService} from '../../rest-api.service';
import {RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';

@Component({selector: 'app-profile', templateUrl: './profile.component.html', styleUrls: ['./profile.component.scss']})
export class ProfileComponent implements OnInit {
  tabNum = 1;

  constructor(public data: DataService, private router: Router, private rest: RestApiService) {
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
          } else if (event.url.includes('stores')) {
            this.tabNum = 5;
          } else {
            this.tabNum = 1;
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

  async fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('image', file, file.name);
      const data = await this.rest.uploadImage(formData);
      console.log();

      try {
        const resp = await this
          .rest
          .updateAvatar({
            picture: data['file']
          });

        if (resp['meta'].success) {
          this
            .data
            .success(resp['meta'].message);

          this
            .data
            .getProfile();
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    }
  }
}
