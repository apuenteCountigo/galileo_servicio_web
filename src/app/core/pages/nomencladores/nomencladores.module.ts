import { NomencladorComponent } from './../../components/nomencladores/nomenclador/nomenclador.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NomencladoresRoutingModule } from './nomencladores-routing.module';
import { NomencladoresComponent } from './nomencladores.component';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NomencladorFormComponent } from '../../components/nomencladores/nomenclador-form/nomenclador-form.component';

@NgModule({
  declarations: [
    NomencladoresComponent,
    NomencladorComponent,
    NomencladorFormComponent
  ],
  imports: [
    CommonModule,
    NomencladoresRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class NomencladoresModule {}
