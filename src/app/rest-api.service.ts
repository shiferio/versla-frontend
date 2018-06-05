import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URL = 'http://192.168.43.100:3030';

@Injectable({ providedIn: 'root' })
export class RestApiService {

  constructor(private http: HttpClient) { }

  getHeaders() {
    const token = localStorage.getItem('token');
    return token
      ? new HttpHeaders().set('Authorization', token)
      : null;
  }
  get(link: string) {
    return this
      .http
      .get(link, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  post(link: string, body: any) {
    return this
      .http
      .post(link, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }
  put(link: string, body: any) {
    return this
      .http
      .put(link, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  createStore(body: any) {
    return this
      .http
      .post(`${API_URL}/api/stores/add`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  deleteStore(link: string) {
    return this
      .http
      .request('DELETE', `${API_URL}/api/stores/delete`, {
        headers: this.getHeaders(),
        body: {
          link: link
        }
      })
      .toPromise();
  }

  updatePassword(body: any) {
    return this
      .http
      .put(`${API_URL}/api/accounts/profile/security`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateAddress(body: any) {
    return this
      .http
      .put(`${API_URL}/api/accounts/profile/address`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateAvatar(body: any) {
    return this
      .http
      .put(`${API_URL}/api/accounts/profile/avatar`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }
}
