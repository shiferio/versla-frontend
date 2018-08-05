import {Component, OnInit} from '@angular/core';

import {DataService} from '../../data.service';
import {Router, NavigationEnd} from '@angular/router';
import {RestApiService} from '../../rest-api.service';
import {RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import {UploadFileService} from '../../upload-file.service';

@Component({selector: 'app-profile', templateUrl: './profile.component.html', styleUrls: ['./profile.component.scss']})
export class ProfileComponent implements OnInit {
  tabNum = 1;

  constructor(
    public data: DataService,
    private router: Router,
    private rest: RestApiService,
    private spinner: NgxSpinnerService,
    private fileUploader: UploadFileService
  ) {
    this
      .data
      .getProfile();

    this.router
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
          } else if (event.url.includes('purchases')) {
            this.tabNum = 6;
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
    this.data.setTitle('Профиль');
  }

  async fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      const pictureUrl = await this
        .fileUploader
        .uploadImage(file);

      try {
        const resp = await this
          .rest
          .updateAvatar({
            picture: pictureUrl
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
