import { Injectable } from '@angular/core';
import { HateoasResourceOperation, HateoasResourceService, NgxHateoasClientConfigurationService, PagedResourceCollection } from '@lagoshny/ngx-hateoas-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageParam, Sort } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { ModeloBaliza } from 'src/app/core/models/momencaldores.model';

@Injectable({
  providedIn: 'root'
})
export class NomencladorModelosBalizasService extends HateoasResourceOperation<ModeloBaliza> {

  constructor(
    public resourceService: HateoasResourceService,
    private hateoasConfig: NgxHateoasClientConfigurationService
    ) {
      super(ModeloBaliza)
     }

  public getAll(
    params?: PageParam,
    sort?: Sort
    ): Observable<PagedResourceCollection<ModeloBaliza>> {
      this.changeUrl();
      return this.resourceService.getPage(ModeloBaliza, {
        pageParams: params,
        sort,
      });
  }

  public create(
    modeloBaliza: ModeloBaliza
  ): Observable<Observable<never> | ModeloBaliza> {
    this.changeUrl();
    return super.createResource({ body: modeloBaliza });
  }

  public detele(
    modeloBaliza: ModeloBaliza
  ): Observable<Observable<never> | ModeloBaliza> {
    this.changeUrl();
    return super.deleteResourceById(modeloBaliza.id as number);
  }

  public put(modeloBaliza: ModeloBaliza): Observable<Observable<never> | ModeloBaliza> {
    this.changeUrl();
    return super.updateResourceById(modeloBaliza.id as number, {
      body: modeloBaliza,
    });
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL_MODELOSBALIZAS,
      },
    });
  }
}

