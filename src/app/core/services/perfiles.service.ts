import { Injectable } from '@angular/core';
import {
  HateoasResourceOperation,
  HateoasResourceService,
  NgxHateoasClientConfigurationService,
  ResourceCollection,
} from '@lagoshny/ngx-hateoas-client';
import { HateoasConfiguration } from '@lagoshny/ngx-hateoas-client/lib/config/hateoas-configuration.interface';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Rol } from '../models/momencaldores.model';

@Injectable({
  providedIn: 'root',
})
export class PerfilesService extends HateoasResourceOperation<Rol> {
  constructor(
    public resourceService: HateoasResourceService,
    public hateoasConfig: NgxHateoasClientConfigurationService
  ) {
    super(Rol);
  }

  public getAll(): Observable<ResourceCollection<Rol>> {
    this.changeUrl();
    return this.resourceService.getPage(Rol).pipe(shareReplay());
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_PERFIL,
      },
    });
  }
}
