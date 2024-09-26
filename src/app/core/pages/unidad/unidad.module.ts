import { PermisosTablaComponent } from './../../components/permisos/permisos-tabla/permisos-tabla.component';
import { BalizaModule } from './../baliza/baliza.module';
import { ObjetivosFormComponent } from './../../components/objetivos/objetivos-form/objetivos-form.component';
import { OperacionesTablaComponent } from './../../components/operaciones/operaciones-tabla/operaciones-tabla.component';
import { FileUploadModalComponent } from './../../components/file-upload-modal/file-upload-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UnidadRoutingModule } from './unidad-routing.module';
import { UnidadComponent } from './unidad.component';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd-module.module';
import { UnitFormComponent } from '../../components/unit/unit-form/unit-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnitOficialPipe } from '../../pipes/unit-oficial.pipe';
import { NotificationService } from '../../services/notification.service';
import { SelectOficialComponent } from '../../components/unit/select-oficial/select-oficial.component';
import { HttpClientModule } from '@angular/common/http';
import { OperacionesFormComponent } from '../../components/operaciones/operaciones-form/operaciones-form.component';
import { ObjetivosTablaComponent } from '../../components/objetivos/objetivos-tabla/objetivos-tabla.component';
import { PermisosFormComponent } from '../../components/permisos/permisos-form/permisos-form.component';
import { BalizasTablaComponent } from '../../components/unidades/balizas-tabla/balizas-tabla.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ObjetivosHistoricoComponent } from '../../components/objetivos/objetivos-historico/objetivos-historico.component';
import { ObjetivoDesasignarBalizaComponent } from '../../components/objetivos/objetivos-desasignar-baliza/objetivo-desasignar-baliza/objetivo-desasignar-baliza.component';
import { HistoricoBalizasObjetivosComponent } from '../../components/objetivos/historico-balizas-objetivos/historico-balizas-objetivos.component';
import { ObjetivoAsignarBalizaComponent } from '../../components/objetivos/objetivos-desasignar-baliza/objetivo-asignar-baliza/objetivo-asignar-baliza.component';
import { ConfiguracionBalizaComponent } from '../../components/objetivos/configuracion-baliza/configuracion-baliza.component';
import { WizardPositionsComponent } from '../../components/objetivos/wizard-positions/wizard-positions.component';
import { StringListPipe } from '../../pipes/string-list.pipe';
import { InformeTablaComponent } from '../../components/objetivos/informe-tabla/informe-tabla.component';
import { SelectOficialSaComponent } from '../../components/unit/select-oficial-sa/select-oficial-sa.component';
import { SelectBalizasComponent } from '../../components/unit/select-balizas/select-balizas.component';
import { CsvListComponent } from '../../components/csv/csv-list.component';
import { ZipListComponent } from '../../components/zip/zip-list.component';

@NgModule({
  declarations: [
    UnidadComponent,
    UnitFormComponent,
    UnitOficialPipe,
    FileUploadModalComponent,
    SelectOficialComponent,
    OperacionesTablaComponent,
    OperacionesFormComponent,
    ObjetivosTablaComponent,
    ObjetivosFormComponent,
    ObjetivosHistoricoComponent,
    PermisosTablaComponent,
    PermisosFormComponent,
    BalizasTablaComponent,
    ObjetivoDesasignarBalizaComponent,
    HistoricoBalizasObjetivosComponent,
    ObjetivoAsignarBalizaComponent,
    ConfiguracionBalizaComponent,
    WizardPositionsComponent,
    StringListPipe,
    InformeTablaComponent,
    SelectOficialSaComponent,
    SelectBalizasComponent,
    CsvListComponent,
    ZipListComponent,
  ],
  imports: [
    CommonModule,
    UnidadRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BalizaModule,
    NgxPermissionsModule.forChild(),
  ],
  providers: [UnitOficialPipe, NotificationService, DatePipe],
  exports: [FileUploadModalComponent],
})
export class UnidadModule {}
