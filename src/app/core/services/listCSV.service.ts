import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageableObjectResponse } from '../dto/PageableObject';
import { EvidenceFilter } from '../dto/evidenceFilter';

@Injectable({
    providedIn: 'root',
  })
  export class ListCSVFiles {
    constructor(private http: HttpClient) {}

    getCsvFiles(unidadName: string="", operacionName: string="", fechaInicio: string="", fechaFin: string="", page: number = 0, size: number = 20, filterName: string=""): Observable<PageableObjectResponse> {
        let params = new HttpParams()
          .set('unidadName', unidadName)
          .set('operacionName', operacionName)
          .set('filterName', filterName)
          .set('fechaInicio', fechaInicio)
          .set('fechaFin', fechaFin)
          .set('page', page.toString())
          .set('size', size.toString());
    
        return this.http.get<PageableObjectResponse>(environment.API_URL_EVIDENCIAS+"/listCSV", { params });
    }
}