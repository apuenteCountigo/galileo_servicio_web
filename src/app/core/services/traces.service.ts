import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HateoasResourceOperation,
  HateoasResourceService,
  NgxHateoasClientConfigurationService,
  PagedResourceCollection,
} from '@lagoshny/ngx-hateoas-client';
import {
  PageParam,
  Sort,
} from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Trace } from '../models/trace.model';
import { ResumenUnit, Unit } from './../models/unit.model';

@Injectable({
  providedIn: 'root',
})
export class TracesService extends HateoasResourceOperation<Trace> {
  searchUnitQuery = 'filtrar';
  searchSinAsignarUnitQuery = 'sinasignar';
  searchAsignadaUnitQuery = 'asignadas';
  searchFiltro_asignadasQuery = 'filtro_asignadas';
  searchFiltro_TrazasQuery = 'filtrar';
  resumenUrl = `${environment.API_URL_UNIDAD}/unidades/search/resumen`;

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService,
    private http: HttpClient
  ) {
    super(Trace);
  }


  public getAll(
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Trace>> {
    this.changeUrl();
    return this.resourceService.getPage(Trace, {
      pageParams: params,
      sort: sort ? sort : { fechaCreacion: 'DESC' },
    });
  }

  public search(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Trace>> {
    this.changeUrl();
    return this.resourceService.searchPage(Trace, this.searchUnitQuery, {
      params: filter,
      pageParams: params,
      sort,
    });
  }

  searchBy(
    filter: any,
    query: string,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Trace>> {
    this.changeUrl();
    return this.resourceService.searchPage(Trace, query, {
      params: filter,
      pageParams: params,
      sort,
    });
  }


  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_TRAZAS,
      },
      cache: {
        enabled: false,
      },
    });
  }

  public searchCriterio(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Trace>> {
    this.changeUrl();
    return this.resourceService.searchPage(
      Trace,
      this.searchFiltro_TrazasQuery,
      {
        params: filter,
        pageParams: params,
        sort,
      }
    );
  }
}

