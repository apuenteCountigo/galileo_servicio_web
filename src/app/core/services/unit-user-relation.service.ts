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
import { UnitUserRelation } from './../models/unit.model';

@Injectable({
  providedIn: 'root',
})
export class UnitUserRelationService extends HateoasResourceOperation<UnitUserRelation> {
  searcByUnitQuery = 'filtrarUsuarios';

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
  ) {
    super(UnitUserRelation);
  }

  public create(
    relation: any
  ): Observable<Observable<never> | UnitUserRelation> {
    this.changeUrl();
    return super.createResource({ body: relation });
  }

  public detele(
    idRelation: number
  ): Observable<Observable<never> | UnitUserRelation> {
    this.changeUrl();
    return super.deleteResourceById(idRelation);
  }

  public getAll(
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<UnitUserRelation>> {
    this.changeUrl();
    return this.resourceService.getPage(UnitUserRelation, {
      pageParams: params,
      sort,
    });
  }

  public search(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<UnitUserRelation>> {
    this.changeUrl();
    return this.resourceService.searchPage(
      UnitUserRelation,
      this.searcByUnitQuery,
      {
        params: filter,
        pageParams: params,
        sort,
      }
    );
  }

  searchBy(
    filter: any,
    query: string,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<UnitUserRelation>> {
    this.changeUrl();
    return this.resourceService.searchPage(UnitUserRelation, query, {
      params: filter,
      pageParams: params,
      sort,
    });
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_UNIDAD_USUARIO_RELATION,
      },
      cache: {
        enabled: false,
      },
    });
  }
}
