import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HateoasResourceOperation,
  HateoasResourceService,
  HttpMethod,
  NgxHateoasClientConfigurationService,
  Resource,
} from '@lagoshny/ngx-hateoas-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Baliza } from '../models/baliza.model';
import {
  Asignadas,
  EstadoPeticionRequestDto,
  Geocerca,
  NoAsignadas,
} from '../models/geocerca.model';
import { Objetivo } from '../models/objetivo.modal';
import { replaceUrl } from '../utils/replace-url';

@Injectable({
  providedIn: 'root',
})
export class GeocercaService extends HateoasResourceOperation<Geocerca> {
  constructor(
    private hateoasConfig: NgxHateoasClientConfigurationService,
    public resourceService: HateoasResourceService,
    private http: HttpClient
  ) {
    super(Geocerca);
  }

  getGeocercasList(baliza: Baliza): Observable<Geocerca> {
    this.changeUrl();
    return this.resourceService.customQuery(Geocerca, HttpMethod.POST, '/', {
      body: baliza,
    });
  }

  getEstadoEnvio(url: string) {
    return this.http.get<EstadoPeticionRequestDto>(url);
  }

  deleteGeocerca(geocerca: Asignadas, urlToReplace: string) {
    const newUrl = replaceUrl(
      environment.API_URL_GEOCERCA,
      geocerca.getRelationLink('delete-geocerca').href,
      urlToReplace
    );
    return this.http.delete(newUrl);
  }

  addGeocerca(geocerca: NoAsignadas, urlToReplace: string) {
    const newUrl = replaceUrl(
      environment.API_URL_GEOCERCA,
      geocerca.getRelationLink('add-geocerca').href,
      urlToReplace
    );
    return this.http.post(newUrl, undefined);
  }

  changeGeocercaState(geocerca: Asignadas, urlToReplace: string) {
    const newUrl = replaceUrl(
      environment.API_URL_GEOCERCA,
      geocerca.hasRelation('activar-geocerca')
        ? geocerca.getRelationLink('activar-geocerca').href
        : geocerca.getRelationLink('desactivar-geocerca').href,
      urlToReplace
    );
    return this.http.put(newUrl, undefined);
  }

  changeUrl() {
    this.hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL,
      },
      cache: {
        enabled: false,
      },
    });
  }
}
