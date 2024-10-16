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
import { Baliza, DataminerElements } from '../models/baliza.model';

@Injectable({
  providedIn: 'root',
})
export class BalizaService extends HateoasResourceOperation<Baliza> {
  searchQuery = 'buscarBalizas';
  searchFiltrarQuery = 'filtro';
  sarchObjetivo = 'filtrarObjetivo';

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService,
    private http: HttpClient
  ) {
    super(Baliza);
  }

  public create(baliza: Baliza): Observable<Observable<never> | Baliza> {
    this.changeUrl();
    return super.createResource({ body: baliza });
  }

  public update(currentBaliza: Baliza): Observable<Observable<never> | Baliza> {
    this.changeUrl();
    return super.patchResourceById(currentBaliza.id as number, {
      body: currentBaliza,
    });
  }

  public put(currentBaliza: Baliza): Observable<Observable<never> | Baliza> {
    this.changeUrl();
    return super.updateResourceById(currentBaliza.id as number, {
      body: currentBaliza,
    });
  }

  public detele(baliza: Baliza): Observable<Observable<never> | Baliza> {
    this.changeUrl();
    return super.deleteResourceById(baliza.id as number);
  }

  public getAll(
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Baliza>> {
    this.changeUrl();
    return this.resourceService
      .getPage(Baliza, {
        pageParams: params,
        sort,
      })
      .pipe(shareReplay());
  }

  public search(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Baliza>> {
    this.changeUrl();
    return this.resourceService
      .searchPage(Baliza, this.searchQuery, {
        params: filter,
        pageParams: params,
        sort,
      })
      .pipe(shareReplay());
  }

  searchBy(query: string, filter: any) {
    this.changeUrl();
    return this.resourceService
      .searchResource(Baliza, query, {
        params: filter,
      })
      .pipe(shareReplay());
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_BALIZA,
      },
      cache: {
        enabled: false,
      },
    });
  }

  public searchFiltrar(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Baliza>> {
    this.changeUrl();
    return this.resourceService
      .searchPage(Baliza, this.searchFiltrarQuery, {
        params: filter,
        pageParams: params,
      })
      .pipe(shareReplay());
  }
  public patch(baliza: any): Observable<Observable<never> | Baliza> {
    this.changeUrl();
    return super.patchResourceById(baliza.id as number, {
      body: baliza,
    });
  }

  public searchByObjetiv(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Baliza>> {
    this.changeUrl();
    return this.resourceService
      .searchPage(Baliza, this.sarchObjetivo, {
        params: filter,
        pageParams: params,
        sort: sort ? sort : { 'b.fechaAlta': 'DESC' },
      })
      .pipe(shareReplay());
  }

  public getCountDataminer() {
    return this.http.post<Array<DataminerElements>>(
      environment.API_URL_DATAMINER_LIMIT_ELEMENTS,
      null
    );
  }
}
