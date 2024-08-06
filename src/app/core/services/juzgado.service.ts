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
import { Juzgado } from '../models/juzgado.model';

@Injectable({
  providedIn: 'root',
})
export class JuzgadoService extends HateoasResourceOperation<Juzgado> {
  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
  ) {
    super(Juzgado);
  }

  public create(juzgado: Juzgado): Observable<Observable<never> | Juzgado> {
    this.changeUrl();
    return super.createResource({ body: juzgado });
  }

  public update(
    currentJuzgado: Juzgado
  ): Observable<Observable<never> | Juzgado> {
    this.changeUrl();
    return super.patchResourceById(currentJuzgado.id as number, {
      body: currentJuzgado,
    });
  }

  public put(currentJuzgado: Juzgado): Observable<Observable<never> | Juzgado> {
    this.changeUrl();
    return super.updateResourceById(currentJuzgado.id as number, {
      body: currentJuzgado,
    });
  }

  public detele(Juzgado: Juzgado): Observable<Observable<never> | Juzgado> {
    this.changeUrl();
    return super.deleteResourceById(Juzgado.id as number);
  }

  public getAll(
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<Juzgado>> {
    this.changeUrl();
    return this.resourceService
      .getPage(Juzgado, {
        pageParams: params,
        sort: sort ? sort : { fechaCreacion: 'DESC' },
      })
      .pipe(shareReplay());
  }

  searchBy(query: string, filter: any) {
    this.changeUrl();
    return this.resourceService
      .searchPage(Juzgado, query, {
        params: filter,
      })
      .pipe(shareReplay());
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_JUZGADO,
      },
      cache: {
        enabled: false,
      },
    });
  }
}
