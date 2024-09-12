import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HateoasResourceOperation,
  HateoasResourceService,
  NgxHateoasClientConfigurationService,
  PagedResourceCollection,
  Sort,
} from '@lagoshny/ngx-hateoas-client';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Operacion } from '../models/operacion.model';
import { ResumenOper } from '../models/unit.model';

@Injectable({
  providedIn: 'root',
})
export class OperacionService extends HateoasResourceOperation<Operacion> {
  searchQuery = 'filtrar';
  searchAsignedOperacionQuery = 'asignados';
  resumenUrl = `${environment.API_URL_OPERACION}/operaciones/search/resumen`;

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService,
    private http: HttpClient
  ) {
    super(Operacion);
  }

  public create(
    operacion: Operacion,
    wsId?: String
  ): Observable<Observable<never> | Operacion> {
    this.changeUrl(wsId);
    return super.createResource({ body: operacion });
  }

  public put(operacion: Operacion): Observable<Observable<never> | Operacion> {
    this.changeUrl();
    return super.updateResourceById(operacion.id as number, {
      body: operacion,
    });
  }

  public update(
    operacion: Operacion
  ): Observable<Observable<never> | Operacion> {
    this.changeUrl();
    return super.updateResource(operacion);
  }

  public detele(
    operacion: Operacion
  ): Observable<Observable<never> | Operacion> {
    this.changeUrl();
    return super.deleteResourceById(operacion.id as number);
  }

  public getAll(
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Operacion>> {
    this.changeUrl();
    return this.resourceService.getPage(Operacion, {
      pageParams: params,
      sort,
    });
  }

  public search(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Operacion>> {
    this.changeUrl();
    return this.resourceService
      .searchPage(Operacion, this.searchQuery, {
        params: filter,
        pageParams: params,
        sort,
      })
      .pipe(shareReplay());
  }

  changeUrl(wsID?:String) {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_OPERACION, //+ (wsID && wsID != '' ? '?wsId='+wsID : ''),
      },
      cache: {
        enabled: false,
      },
    });
  }

  searchAsignedOficials(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Operacion>> {
    this.changeUrl();
    return this.resourceService
      .searchPage(Operacion, this.searchAsignedOperacionQuery, {
        params: filter,
        pageParams: params,
        sort,
      })
      .pipe(shareReplay());
  }

  getResumen(filter: any) {
    return this.http.get<ResumenOper>(this.resumenUrl, { params: filter });
  }

  public patch(operacion: any): Observable<Observable<never> | Operacion> {
    this.changeUrl();
    return super.patchResourceById(operacion.id as number, {
      body: operacion,
    });
  }
}
