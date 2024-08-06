import { Injectable } from '@angular/core';
import {
  HateoasResourceOperation,
  HateoasResourceService,
  NgxHateoasClientConfigurationService,
  PagedResourceCollection,
} from '@lagoshny/ngx-hateoas-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Historico } from '../models/historico.model';

@Injectable({
  providedIn: 'root',
})
export class HistoricoService extends HateoasResourceOperation<Historico> {
  private query = 'filtrar';

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
  ) {
    super(Historico);
  }

  public getAll(): Observable<PagedResourceCollection<Historico>> {
    this.changeUrl();
    return this.resourceService.getPage(Historico, {
      pageParams: { page: 0, size: 100 },
    });
  }

  public filter(filter: any) {
    this.changeUrl();
    return super.searchPage(this.query, {
      params: filter,
      pageParams: { page: 0, size: 100 },
    });
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_HISTORICO,
      },
    });
  }
}
