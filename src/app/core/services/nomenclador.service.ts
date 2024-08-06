import { Injectable } from '@angular/core';
import {
  HateoasResourceOperation,
  HateoasResourceService,
  NgxHateoasClientConfigurationService,
  PagedResourceCollection,
} from '@lagoshny/ngx-hateoas-client';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estado } from '../models/estado.model';
import { Juzgado } from './../models/juzgado.model';

@Injectable({
  providedIn: 'root',
})
export class NomencladorService extends HateoasResourceOperation<
  Juzgado | Estado
> {
  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
  ) {
    super(Juzgado || Estado);
  }

  public create(nomenclador: Juzgado): Observable<Juzgado> {
    return super.createResource({ body: nomenclador });
  }

  public update(
    nomenclador: Estado | Juzgado
  ): Observable<Observable<never> | Juzgado | Estado> {
    return super.updateResource(nomenclador);
  }

  public detele(
    nomenclador: Estado | Juzgado
  ): Observable<Observable<never> | Juzgado | Estado> {
    return super.updateResource(nomenclador);
  }

  public getAll(
    params?: PageParam,
    nomenclador?: any,
    tipoNomenclador?: any
  ): Observable<PagedResourceCollection<any>> {
    this.changeUrl(nomenclador);
    return this.resourceService.getPage(tipoNomenclador, {
      pageParams: params,
    });
  }

  changeUrl(nomenclador: any) {
    let url;
    switch (nomenclador) {
      case 'Juzgado':
        url = environment.API_URL_JUZGADO;
        break;
      case 'Estado':
        url = environment.API_URL_ESTADO;
        break;
      default:
        url = environment.API_URL_BALIZA;
        break;
    }
    this.hateoasConfig.configure({
      http: {
        rootUrl: url,
      },
    });
  }
}
