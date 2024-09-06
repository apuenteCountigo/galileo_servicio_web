import { Injectable } from '@angular/core';
import { HateoasResourceOperation, HateoasResourceService, NgxHateoasClientConfigurationService, PagedResourceCollection } from '@lagoshny/ngx-hateoas-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageParam, Sort } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { ModeloBaliza } from 'src/app/core/models/momencaldores.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NomencladorModelosBalizasService extends HateoasResourceOperation<ModeloBaliza> {

  constructor(
    public resourceService: HateoasResourceService,
    private http: HttpClient,
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

  public getModelos(
    params?: PageParam,
    sort?: Sort
    ): Observable<PagedResourceCollection<ModeloBaliza>> {
      this.changeUrl();
      return super.resourceService.getPage(ModeloBaliza, {
        pageParams: params,
        sort,
      });
  }

  // public async getModelos(): Observable<Array<ModeloBaliza>> {
  //   let rsc=await this.http.get<PagedResourceCollection<ModeloBaliza>>(
  //     environment.API_URL_MODELOSBALIZAS+'/modelosbalizas'
  //   );
  //   return rsc._embedded.modelosbalizas || [];
  // }

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

