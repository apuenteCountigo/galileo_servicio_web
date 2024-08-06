import { Injectable } from '@angular/core';
import {
  HateoasResourceOperation,
  HateoasResourceService,
  NgxHateoasClientConfigurationService,
  PagedResourceCollection,
  Resource,
  ResourceCollection,
} from '@lagoshny/ngx-hateoas-client';
import {
  PageParam,
  Sort,
} from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Permiso } from './../models/permiso.model';

@Injectable({
  providedIn: 'root',
})
export class PermisosService extends HateoasResourceOperation<Permiso> {
  private searchAsignados_operacionessQuery = 'asignados_operaciones';
  private searchSinasignar_operacionessQuery = 'sinasignar_operaciones';
  private searchAsignados_objetivosQuery = 'asignados_objetivos';
  private searchSinasignar_objetivosQuery = 'sinasignar_objetivos';
  private queryUsuario = 'conpermisos_objetivos';

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
  ) {
    super(Permiso);
  }
  public create(permiso: any): Observable<Observable<never> | Permiso> {
    this.changeUrl();
    return super.createResource({ body: permiso });
  }

  public put(permiso: Permiso): Observable<Observable<never> | Permiso> {
    this.changeUrl();
    return super.updateResourceById(permiso.id as number, {
      body: permiso,
    });
  }

  public patch(permiso: any): Observable<Observable<never> | Permiso> {
    this.changeUrl();
    return super.patchResourceById(permiso.id as number, {
      body: permiso,
    });
  }

  public getAll(
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Permiso>> {
    this.changeUrl();
    return this.resourceService.getPage(Permiso, {
      pageParams: params,
      sort,
    });
  }

  public searchPermisosAsignados(
    filter: any,
    params?: PageParam,
    sort?: Sort,
    query?: string
  ): Observable<PagedResourceCollection<Permiso>> {
    this.changeUrl();
    return this.resourceService.searchPage(
      Permiso,
      query == 'operacion'
        ? this.searchAsignados_operacionessQuery
        : this.searchAsignados_objetivosQuery,
      {
        params: filter,
        pageParams: params,
        sort: sort ? sort : { id: 'DESC' },
      }
    );
  }
  public searchPermisosAsignadosUsuario(filter: any): Observable<Permiso> {
    this.changeUrl();
    return this.resourceService.searchResource(Permiso, this.queryUsuario, {
      params: filter,
    });
  }

  public searchPermisosSinAsignar(
    filter: any,
    params?: PageParam,
    sort?: Sort,
    query?: string
  ): Observable<PagedResourceCollection<Permiso>> {
    this.changeUrl();
    return this.resourceService.searchPage(
      Permiso,
      query == 'operacion'
        ? this.searchSinasignar_operacionessQuery
        : this.searchSinasignar_objetivosQuery,
      {
        params: filter,
        pageParams: params,
        sort: sort ? sort : { id: 'DESC' },
      }
    );
  }

  public detele(operacion: Permiso): Observable<Observable<never> | Permiso> {
    this.changeUrl();
    return super.deleteResourceById(operacion.id as number);
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_PERMISOS,
      },
      cache: {
        enabled: false,
      },
    });
  }
}
