import { UserProjection } from './../models/users.model';
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
import { Observable, shareReplay } from 'rxjs';
import { User } from '../models/users.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService extends HateoasResourceOperation<User> {
  private searchQuery = 'buscarUsuarios';
  private searchFreeOficialQuery = 'sinasignar';
  private searchAsignedOficialQuery = 'asignados';

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
  ) {
    super(User);
  }

  public create(user: User): Observable<Observable<never> | User> {
    this.changeUrl();
    return super.createResource({ body: user });
  }

  public update(currentUser: User): Observable<Observable<never> | User> {
    this.changeUrl();
    return super.patchResourceById(currentUser.id as number, {
      body: currentUser,
    });
  }

  pasworChange(id: number, body: any): Observable<Observable<never> | User> {
    this.changeUrl();
    return super.patchResourceById(id, { body });
  }

  public put(currentUser: User): Observable<Observable<never> | User> {
    this.changeUrl();
    return super.updateResourceById(currentUser.id as number, {
      body: currentUser,
    });
  }

  public detele(user: User): Observable<Observable<never> | User> {
    this.changeUrl();
    return super.deleteResourceById(user.id as number);
  }

  public getAll(
    query: string,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<User>> {
    this.changeUrl();
    sort!['fechaCreacion'] = 'DESC';
    return this.resourceService
      .getPage(User, {
        pageParams: params,
        sort,
      })
      .pipe(shareReplay());
  }

  public search(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<User>> {
    this.changeUrl();
    return this.resourceService
      .searchPage(User, this.searchQuery, {
        params: filter,
        pageParams: params,
        sort,
      })
      .pipe(shareReplay());
  }

  public getAllUserProjection(): Observable<
    ResourceCollection<UserProjection>
  > {
    this.changeUrl();
    return this.resourceService
      .getCollection(UserProjection)
      .pipe(shareReplay());
  }

  searchFreeOficials(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<User>> {
    this.changeUrl();
    return this.resourceService
      .searchPage(User, this.searchFreeOficialQuery, {
        params: filter,
        pageParams: params,
        sort,
      })
      .pipe(shareReplay());
  }

  searchAsignedOficials(filter: any, params?: PageParam, sort?: Sort) {
    this.changeUrl();
    return this.resourceService
      .searchPage(User, this.searchAsignedOficialQuery, {
        params: filter,
        pageParams: params,
        sort,
      })
      .pipe(shareReplay());
  }

  searchBy(query: string, filter: any) {
    this.changeUrl();
    return this.resourceService
      .searchResource(User, query, {
        params: filter,
      })
      .pipe(shareReplay());
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_USUARIO,
      },
      cache: {
        enabled: false,
      },
    });
  }

  public searchAux(
    filter: any,
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<User>> {
    this.changeUrl();
    return this.resourceService
      .searchPage(User, this.searchAsignedOficialQuery, {
        params: filter,
        pageParams: params,
        sort: sort ? sort : { 'u.fechaCreacion': 'DESC' },
      })
      .pipe(shareReplay());
  }
}
