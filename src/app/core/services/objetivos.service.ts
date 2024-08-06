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
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Objetivo } from '../models/objetivo.modal';

@Injectable({
  providedIn: 'root',
})
export class ObjetivosService extends HateoasResourceOperation<Objetivo> {
  searchQuery = 'filtrar';
  searchDeviceQuery = 'dispositivo';

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
  ) {
    super(Objetivo);
  }

  public create(objetivo: Objetivo): Observable<Observable<never> | Objetivo> {
    this.changeUrl();
    return super.createResource({ body: objetivo });
  }

  public detele(operacion: Objetivo): Observable<Observable<never> | Objetivo> {
    this.changeUrl();
    return super.deleteResourceById(operacion.id as number);
  }

  public put(objetivo: Objetivo): Observable<Observable<never> | Objetivo> {
    this.changeUrl();
    return super.updateResourceById(objetivo.id as number, {
      body: objetivo,
    });
  }

  public search(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Objetivo>> {
    this.changeUrl();
    return this.resourceService.searchPage(Objetivo, this.searchQuery, {
      params: filter,
      pageParams: params,
      sort: sort ? sort : { fechaCreacion: 'DESC' },
    });
  }

  public searchDevices(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Objetivo>> {
    this.changeUrl();
    return this.resourceService.searchPage(Objetivo, this.searchDeviceQuery, {
      params: filter,
      pageParams: params,
      sort,
    });
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_OBJETIVOS,
      },
      cache: {
        enabled: false,
      },
    });
  }
}
