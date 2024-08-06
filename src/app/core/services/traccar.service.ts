import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TraccarService {
  constructor(private http: HttpClient) {}

  getMapa(token: string) {
    let params = new HttpParams().set('token', token);
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
    });

    return this.http.get(`${environment.API_URL_TRACCAR}`, {
      responseType: 'text',
      headers,
      params,
    });
  }
}
