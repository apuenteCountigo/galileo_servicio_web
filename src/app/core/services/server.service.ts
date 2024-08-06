import { Injectable } from '@angular/core';
import {
  HateoasResourceOperation,
  HateoasResourceService,
  Sort,
  PagedResourceCollection,
  NgxHateoasClientConfigurationService,
} from '@lagoshny/ngx-hateoas-client';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Server } from '../models/server.model';

@Injectable({
  providedIn: 'root',
})
export class ServerService extends HateoasResourceOperation<Server> {
  searchQuery = 'filtrar';

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
  ) {
    super(Server);
  }

  public create(server: Server): Observable<Observable<never> | Server> {
    this.changeUrl();
    return super.createResource({ body: server });
  }

  public update(currentServer: Server): Observable<Observable<never> | Server> {
    this.changeUrl();
    return super.updateResourceById(currentServer.id as number, {
      body: currentServer,
    });
  }

  public detele(server: Server): Observable<Observable<never> | Server> {
    this.changeUrl();
    return super.deleteResourceById(server.id as number);
  }

  public getAll(
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Server>> {
    this.changeUrl();
    return this.resourceService.getPage(Server, {
      pageParams: params,
      sort,
    });
  }

  public search(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Server>> {
    this.changeUrl();
    return this.resourceService.searchPage(Server, this.searchQuery, {
      params: filter,
      pageParams: params,
      sort,
    });
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_SERVIDORES,
      },
      cache: {
        enabled: false,
      },
    });
  }
}
