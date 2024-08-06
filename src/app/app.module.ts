import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { es_ES, NZ_I18N } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import es from '@angular/common/locales/es';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppInitializerProvider } from './app-initializer.service';
import {
  NgxHateoasClientConfigurationService,
  NgxHateoasClientModule,
} from '@lagoshny/ngx-hateoas-client';
import { environment } from 'src/environments/environment';
import { AuthInterceptor } from './core/interceptors/auth-interceptor.interceptor';
import { AuthGuard } from './core/guards/auth.guard';
import { User } from './core/models/users.model';
import { Unit, UnitUserRelation } from './core/models/unit.model';
import { Estado } from './core/models/estado.model';
import { Operacion } from './core/models/operacion.model';
import { Baliza } from './core/models/baliza.model';
import { Server } from './core/models/server.model';
import {
  TipoBaliza,
  TipoContrato,
  TipoEntidad,
  UnitProvince,
} from './core/models/momencaldores.model';
import { NgxPermissionsModule } from 'ngx-permissions';

registerLocaleData(en);
registerLocaleData(es);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxHateoasClientModule.forRoot(),
    NgxPermissionsModule.forRoot(),
  ],
  providers: [
    AppInitializerProvider,
    AuthGuard,
    { provide: NZ_I18N, useValue: es_ES },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(hateoasConfig: NgxHateoasClientConfigurationService) {
    hateoasConfig.configure({
      http: {
        rootUrl: environment.API_URL,
      },
      useTypes: {
        resources: [
          User,
          Unit,
          Estado,
          UnitUserRelation,
          Operacion,
          Baliza,
          Server,
          TipoBaliza,
          TipoContrato,
          TipoEntidad,
          UnitProvince,
        ],
      },
      cache: {
        enabled: false,
      },
    });
  }
}
