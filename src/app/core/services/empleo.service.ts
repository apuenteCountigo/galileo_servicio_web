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
import { Empleo } from '../models/momencaldores.model';

@Injectable({
  providedIn: 'root',
})
export class EmpleoService extends HateoasResourceOperation<Empleo> {
  query = 'filtrar';

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
  ) {
    super(Empleo);
  }

  public getAll(
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Empleo>> {
    this.changeUrl();
    return this.resourceService.getPage(Empleo, {
      pageParams: params,
      sort,
    });
  }

  public create(empleo: Empleo): Observable<Observable<never> | Empleo> {
    this.changeUrl();
    return super.createResource({ body: empleo });
  }

  public detele(empleo: Empleo): Observable<Observable<never> | Empleo> {
    this.changeUrl();
    return super.deleteResourceById(empleo.id as number);
  }

  public put(empleo: Empleo): Observable<Observable<never> | Empleo> {
    this.changeUrl();
    return super.updateResourceById(empleo.id as number, {
      body: empleo,
    });
  }

  public filterByType(filter: any) {
    this.changeUrl();
    return super.searchCollection(this.query, {
      params: filter,
    });
  }

  public search(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Empleo>> {
    this.changeUrl();
    return this.resourceService.searchPage(Empleo, this.query, {
      params: filter,
      pageParams: params,
      sort,
    });
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_EMPLEO,
      },
    });
  }
}
