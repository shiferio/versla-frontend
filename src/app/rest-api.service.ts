import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
      .post('http://localhost:3030/api/stores/add', body, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  deleteStore(link: string) {
    return this
      .http
      .request('DELETE', 'http://localhost:3030/api/stores/delete', {
        headers: this.getHeaders(),
        body: {
          link: link
        }
      })
      .toPromise();
  }
}
