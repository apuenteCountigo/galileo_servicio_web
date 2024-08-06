import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PlanificadorComponent } from './../../components/configuaciones-dataMiner/planificador/planificador.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd-module.module';
import { AlertasOperativaComponent } from '../../components/configuaciones-dataMiner/alertas-operativa/alertas-operativa.component';
import { ConfiguracionAntiBarridoComponent } from '../../components/configuaciones-dataMiner/configuracion-anti-barrido/configuracion-anti-barrido.component';
import { ConfiguracionAvanzadaComponent } from '../../components/configuaciones-dataMiner/configuracion-avanzada/configuracion-avanzada.component';
import { ConfiguracionGpsComponent } from '../../components/configuaciones-dataMiner/configuracion-gps/configuracion-gps.component';
import { AsignadasComponent } from '../../components/configuaciones-dataMiner/geocercas/components/asignadas/asignadas.component';
import { NoAsignadasComponent } from '../../components/configuaciones-dataMiner/geocercas/components/no-asignadas/no-asignadas.component';
import { GeocercasComponent } from '../../components/configuaciones-dataMiner/geocercas/geocercas.component';
import { InstalacionComponent } from '../../components/configuaciones-dataMiner/instalacion/instalacion.component';
import { NuevoPlanificadorComponent } from '../../components/configuaciones-dataMiner/nuevo-planificador/nuevo-planificador.component';
import { UltimaPosicionComponent } from '../../components/configuaciones-dataMiner/ultima-posicion/ultima-posicion.component';
import { TreeviewComponent } from '../../components/treeview/treeview.component';
import { UnidadContextRightClickDirective } from '../../directives/unidad-context-right-click.directive';
import { ConvertDateUTCPipe } from '../../pipes/convert-date-utc.pipe';
import { SafePipe } from '../../pipes/safe-pipe.pipe';
import { DevicesModule } from '../devices/devices.module';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';

@NgModule({
  declarations: [
    WelcomeComponent,
    TreeviewComponent,
    UnidadContextRightClickDirective,
    SafePipe,
    ConfiguracionAvanzadaComponent,
    InstalacionComponent,
    UltimaPosicionComponent,
    ConfiguracionGpsComponent,
    ConfiguracionAntiBarridoComponent,
    AlertasOperativaComponent,
    GeocercasComponent,
    NoAsignadasComponent,
    AsignadasComponent,
    ConvertDateUTCPipe,
    PlanificadorComponent,
    NuevoPlanificadorComponent,
  ],
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    DevicesModule,
  ],
  providers: [SafePipe, ConvertDateUTCPipe],
})
export class WelcomeModule {}
