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
import { UnitProvince } from '../models/province.model';

@Injectable({
  providedIn: 'root',
})
export class UnitProvincesService extends HateoasResourceOperation<UnitProvince> {

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
  ) {
    super(UnitProvince);
  }

  public getAll(
    params?: PageParam,
    sort?: Sort
  ): Observable<PagedResourceCollection<UnitProvince>> {
    this.changeUrl();
    return this.resourceService.getPage(UnitProvince, {
      pageParams: params,
      sort,
    });
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_PROV,
      },
    });
  }
}

