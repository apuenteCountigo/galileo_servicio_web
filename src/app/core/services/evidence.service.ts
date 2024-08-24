import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HateoasResourceOperation,
  HateoasResourceService,
  NgxHateoasClientConfigurationService,
  PagedResourceCollection,
  ResourceCollection,
} from '@lagoshny/ngx-hateoas-client';
import {
  PageParam,
  Sort,
} from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Objetivo } from '../models/objetivo.modal';
import { Position } from '../models/position.model';

@Injectable({
  providedIn: 'root',
})
export class EvidenceService extends HateoasResourceOperation<Position> {
  private searchPositionQuery = 'filtrar';
  private searchSinAsignarUnitQuery = 'sinasignar';
  private searchAsignadaUnitQuery = 'asignadas';
  private searchFiltro_asignadasQuery = 'filtro_asignadas';
  private searchFiltro_TrazasQuery = 'filtrar';
  private resumenUrl = `${environment.API_URL_UNIDAD}/unidades/search/resumen`;
  private API_URL_GENERAR_KMLS = `${environment.API_URL_EVIDENCIAS}/generarKMLS`;
  private API_URL_PROGRESO_EVIDENCIA = `${environment.API_URL_EVIDENCIAS}/progreso`;
  private API_URL_DESCARGA_ZIP = `${environment.API_URL_EVIDENCIAS}/zip`;
  private API_URL_DESCARGA_ZIP_PATH = `${environment.API_URL_EVIDENCIAS}/pathZip`;

  private TEMP_ZIP_PATH: string =
    '/UNIDADES/UPilar/INFORMES OPInforme/PERSONALIZADOS/OPInforme(2022-10-20 08_31_31-2022-10-22 08_31_37).zip';

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService,
    private http: HttpClient
  ) {
    super(Position);
  }

  public getAll(
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Position>> {
    this.changeUrl();
    return this.resourceService.getPage(Position, {
      pageParams: params,
      sort: sort ? sort : { fechaCreacion: 'DESC' },
    });
  }

  public search(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Position>> {
    this.changeUrl();
    return this.resourceService.searchPage(Position, this.searchPositionQuery, {
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
  ): Observable<PagedResourceCollection<Position>> {
    this.changeUrl();
    return this.resourceService.searchPage(Position, query, {
      params: filter,
      pageParams: params,
      sort,
    });
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_EVIDENCIAS,
      },
      cache: {
        enabled: false,
      },
    });
  }

  public generarKMLS(params: any, objetivos: Array<Objetivo>) {
    return this.http.post(this.API_URL_GENERAR_KMLS, objetivos, { params });
  }

  public getZipToDownload(
    idAuth: number,
    zipPath: string = this.TEMP_ZIP_PATH
  ) {

    return this.http.get(this.API_URL_DESCARGA_ZIP, {
      params: { idAuth, zipPath },
      responseType: 'arraybuffer',
    });
  }

  getZipPath(idAuth: number) {
    return this.http.get(this.API_URL_DESCARGA_ZIP_PATH, {
      params: { idAuth },
    });
  }

  public getProgreso() {
    return this.http.get(this.API_URL_PROGRESO_EVIDENCIA);
  }

  public searchCriterio(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<ResourceCollection<Position>> {
    this.changeUrl();
    return this.resourceService.searchCollection(
      Position,
      this.searchPositionQuery,
      {
        params: filter,
        // pageParams: params,
        sort,
      }
    );
  }
}
