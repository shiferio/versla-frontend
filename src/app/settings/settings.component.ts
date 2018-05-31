import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  currentSettings: any = {};

  constructor(private data: DataService, private rest: RestApiService) { }

  async ngOnInit() {
    this.data.getProfile();

    Object.assign(
      this.currentSettings,
      this.data.user
    );
  }

  validate(settings) {
    if (settings.last_name) {
      if (settings.first_name) {
        if (settings.email) {
          return true;
        } else {
          this
            .data
            .error('Email is not entered.');
        }
      } else {
        this
          .data
          .error('First name is not entered.');
      }
    } else {
      this
        .data
        .error('Last name is not entered.');
    }
  }

  async update() {
    if (this.validate(this.currentSettings)) {
      console.log(this.currentSettings);
      try {
        const data = await this
          .rest
          .put('http://88.198.148.140:38925/api/buyer/v1/profile', {
            profile: {
              first_name: this.currentSettings.first_name,
              last_name: this.currentSettings.last_name
            }
          });
        console.log(data);
        if (data['id']) {
          this.data.getProfile();

          this.data.success('Данные успешно обновлены!');
        }
      } catch (error) {
        this.data.error(error['message']);
        console.log(error);
      }
    }
  }

}
