import { Injectable } from '@angular/core';
import {
  HateoasResourceOperation,
  HateoasResourceService,
  NgxHateoasClientConfigurationService,
  PagedResourceCollection,
} from '@lagoshny/ngx-hateoas-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estado } from '../models/estado.model';

@Injectable({
  providedIn: 'root',
})
export class EstadoService extends HateoasResourceOperation<Estado> {
  query = 'filtrar';

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
  ) {
    super(Estado);
  }

  public getAll(): Observable<PagedResourceCollection<Estado>> {
    this.changeUrl();
    return this.resourceService.getPage(Estado);
  }

  public filterByType(filter: any) {
    this.changeUrl();
    return super.searchCollection(this.query, {
      params: filter,
    });
  }

  public filter(filter: any) {
    this.changeUrl();
    return super.searchCollection(this.query, {
      params: filter,
    });
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_ESTADO,
      },
    });
  }
}
