import { Juzgado } from './../../models/juzgado.model';
import { Injectable } from '@angular/core';
import { HateoasResourceOperation, HateoasResourceService, NgxHateoasClientConfigurationService, PagedResourceCollection } from '@lagoshny/ngx-hateoas-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageParam, Sort } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';

@Injectable({
  providedIn: 'root'
})
export class NomencladorJuzgadosService extends HateoasResourceOperation<Juzgado> {

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
    ) {
      super(Juzgado)
     }

  public getAll(
    params?: PageParam,
    sort?: Sort
    ): Observable<PagedResourceCollection<Juzgado>> {
      this.changeUrl();
      return this.resourceService.getPage(Juzgado, {
        pageParams: params,
        sort,
      });
  }

  public create(
    juzgado: Juzgado
  ): Observable<Observable<never> | Juzgado> {
    this.changeUrl();
    return super.createResource({ body: juzgado });
  }

  public detele(
    juzgado: Juzgado
  ): Observable<Observable<never> | Juzgado> {
    this.changeUrl();
    return super.deleteResourceById(juzgado.id as number);
  }

  public put(juzgado: Juzgado): Observable<Observable<never> | Juzgado> {
    this.changeUrl();
    return super.updateResourceById(juzgado.id as number, {
      body: juzgado,
    });
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_JUZGADO,
      },
    });
  }
}

