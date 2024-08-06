import { TipoEntidad } from './../../models/tipoEntidad';
import { Injectable } from '@angular/core';
import { HateoasResourceOperation, HateoasResourceService, NgxHateoasClientConfigurationService, PagedResourceCollection } from '@lagoshny/ngx-hateoas-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NomencladorTipoEntidadService extends HateoasResourceOperation<TipoEntidad>{

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
    ) {
      super(TipoEntidad)
     }

  public getAll(): Observable<PagedResourceCollection<TipoEntidad>> {
    this.changeUrl();
    return this.resourceService.getPage(TipoEntidad);
  }

  public create(
    tipoEntidad: TipoEntidad
  ): Observable<Observable<never> | TipoEntidad> {
    this.changeUrl();
    return super.createResource({ body: tipoEntidad });
  }

  public detele(
    tipoEntidad: TipoEntidad
  ): Observable<Observable<never> | TipoEntidad> {
    this.changeUrl();
    return super.deleteResourceById(tipoEntidad.id as number);
  }

  public put(tipoEntidad: TipoEntidad): Observable<Observable<never> | TipoEntidad> {
    this.changeUrl();
    return super.updateResourceById(tipoEntidad.id as number, {
      body: tipoEntidad,
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
