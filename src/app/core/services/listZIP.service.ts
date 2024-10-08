import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageableObjectResponse } from '../dto/PageableObject';

@Injectable({
    providedIn: 'root',
  })
  export class ListZIPFiles {
    constructor(private http: HttpClient) {}

    getFiles(unidadName: string="", operacionName: string="", page: number = 0, size: number = 20, filterName: string=""): Observable<PageableObjectResponse> {
        let params = new HttpParams()
          .set('unidadName', unidadName)
          .set('operacionName', operacionName)
          .set('filterName', filterName)
          .set('page', page.toString())
          .set('size', size.toString());
    
        return this.http.get<PageableObjectResponse>(environment.API_URL_EVIDENCIAS+"/listZIP", { params });
    }
}