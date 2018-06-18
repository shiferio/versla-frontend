import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';

const API_URL = 'http://api.versla.ru';

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

  uploadImage(body: any) {
    const headers = this.getHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    console.log(body);
    return this
      .http
      .post(`http://images.versla.ru/api/upload/file`, body, {
        headers: headers
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

  getStore(storeLink: string) {
    return this
      .http
      .get(`${API_URL}/api/stores/${storeLink}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  updateStoreInfo(link: string, field: string, body: any) {
    return this
      .http
      .put(`${API_URL}/api/stores/update/${field}`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getUserById(id: string) {
    return this
      .http
      .get(`${API_URL}/api/users/find/id/${id}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getUserByLogin(login: string) {
    return this
      .http
      .get(`${API_URL}/api/users/find/login/${login}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  createGood(body: any) {
    return this
      .http
      .post(`${API_URL}/api/goods/add`, body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  getGoodById(id: number) {
    return this
      .http
      .get(`${API_URL}/api/goods/${id}`, {
        headers: this.getHeaders()
      })
      .toPromise();
  }
}
