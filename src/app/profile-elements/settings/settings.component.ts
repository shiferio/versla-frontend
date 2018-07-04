import {Component, OnInit} from '@angular/core';
import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';


@Component({selector: 'app-settings', templateUrl: './settings.component.html', styleUrls: ['./settings.component.scss']})
export class SettingsComponent implements OnInit {

  currentSettings: any = {};

  constructor(private data: DataService, private rest: RestApiService) {
  }

  async ngOnInit() {
    await this
      .data
      .getProfile();

    Object.assign(this.currentSettings, this.data.user);
  }

  validate(settings) {
    if (settings.email) {
      return true;
    } else {
      this
        .data
        .error('Email is not entered.');
    }
  }

  async update() {
    if (this.validate(this.currentSettings)) {
      console.log(this.currentSettings);
      try {
        const data = await this
          .rest
          .updateUserProfile({
            first_name: this.currentSettings.first_name,
            last_name: this.currentSettings.last_name,
            phone: this.currentSettings.phone,
            email: this.currentSettings.email,
            city: this.currentSettings.city['_id']
          });

        if (data['meta'].success) {
          await this
            .data
            .getProfile();

          this
            .data
            .success('Данные успешно обновлены!');
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    }
  }

}
