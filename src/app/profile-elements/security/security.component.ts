import { Component, OnInit } from '@angular/core';

import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

  old_password = '';
  password = '';
  confirmation_password = '';

  constructor(private rest: RestApiService, private data: DataService) { }

  ngOnInit() {
  }

  validate(): boolean {
    if (this.old_password) {
      if (this.password) {
        if (this.confirmation_password) {
          if (this.password === this.confirmation_password) {
            return true;
          } else {
            this
              .data
              .error('Passwords don\'t match.');
          }
        } else {
          this
            .data
            .error('Confirmation password is not entered.');
        }
      } else {
        this
          .data
          .error('New password is not entered.');
      }
    } else {
      this
        .data
        .error('old password is not entered.');
    }

    return false;
  }

  async update() {
    try {
      if (this.validate()) {
        const data = await this.rest.updatePassword({
          password: this.password,
          old_password: this.old_password,
          confirmation_password: this.confirmation_password
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
