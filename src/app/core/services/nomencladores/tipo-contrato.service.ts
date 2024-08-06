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
import { TipoContrato } from '../../models/momencaldores.model';

@Injectable({
  providedIn: 'root',
})
export class TipoContratoService extends HateoasResourceOperation<TipoContrato> {
  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
  ) {
    super(TipoContrato);
  }

  public getAll(
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<TipoContrato>> {
    this.changeUrl();
    return this.resourceService
      .getPage(TipoContrato, {
        pageParams: params,
        sort,
      })
      .pipe(shareReplay());
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_TIPO_CONTRATO,
      },
      cache: {
        enabled: false,
      },
    });
  }
}
