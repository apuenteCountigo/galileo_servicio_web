import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginInterface } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      Authorization:
        'Basic ' +
        window.btoa(`${environment.OAUTH_ID}:${environment.OAUTH_SECRET}`),
    }),
  };

  constructor(private http: HttpClient) {}

  login(loginRequest: LoginInterface) {
    const body = new HttpParams()
      .set('username', loginRequest.username)
      .set('password', loginRequest.password)
      .set('grant_type', 'password');
    return this.http.post(environment.API_URL_LOGIN, body, this.httpOptions);
  }
}
