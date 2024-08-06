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
import { ResumenUnit, Unit } from './../models/unit.model';

@Injectable({
  providedIn: 'root',
})
export class UnitService extends HateoasResourceOperation<Unit> {
  searchUnitQuery = 'filtrar';
  searchSinAsignarUnitQuery = 'sinasignar';
  searchAsignadaUnitQuery = 'asignadas';
  searchFiltro_asignadasQuery = 'filtro_asignadas';
  searchFiltro_gestionUnidadQuery = 'filtro_gestion_unidad';
  resumenUrl = `${environment.API_URL_UNIDAD}/unidades/search/resumen`;

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService,
    private http: HttpClient
  ) {
    super(Unit);
  }

  public create(unit: Unit): Observable<Observable<never> | Unit> {
    this.changeUrl();
    return super.createResource({ body: unit });
  }

  public put(currentUnit: Unit): Observable<Observable<never> | Unit> {
    this.changeUrl();
    return super.updateResourceById(currentUnit.id as number, {
      body: currentUnit,
    });
  }

  public update(
    unitId: number,
    updatedUnit: Unit
  ): Observable<Observable<never> | Unit> {
    this.changeUrl();
    return super.updateResourceById(unitId as number, { body: updatedUnit });
  }

  public detele(unitId: number): Observable<Observable<never> | Unit> {
    this.changeUrl();
    return super.deleteResourceById(unitId);
  }

  public getAll(
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Unit>> {
    this.changeUrl();
    return this.resourceService.getPage(Unit, {
      pageParams: params,
      sort: sort ? sort : { fechaCreacion: 'DESC' },
    });
  }

  public search(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Unit>> {
    this.changeUrl();
    return this.resourceService.searchPage(Unit, this.searchUnitQuery, {
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
  ): Observable<PagedResourceCollection<Unit>> {
    this.changeUrl();
    return this.resourceService.searchPage(Unit, query, {
      params: filter,
      pageParams: params,
      sort,
    });
  }

  getResumen(filter: any) {
    return this.http.get<ResumenUnit>(this.resumenUrl, { params: filter });
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_UNIDAD,
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
  ): Observable<PagedResourceCollection<Unit>> {
    this.changeUrl();
    return this.resourceService.searchPage(
      Unit,
      this.searchFiltro_gestionUnidadQuery,
      {
        params: filter,
        pageParams: params,
        sort,
      }
    );
  }
}
