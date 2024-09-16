import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageableObjectResponse } from '../dto/PageableObject';

@Injectable({
    providedIn: 'root',
  })
  export class ListCSVFiles {
    constructor(private http: HttpClient) {}

    getCsvFiles(page: number = 0, size: number = 10): Observable<PageableObjectResponse> {
        let params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());
    
        return this.http.get<PageableObjectResponse>(environment.API_URL_EVIDENCIAS+"/listCSV", { params });
    }
}