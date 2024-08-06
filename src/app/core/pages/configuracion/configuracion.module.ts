import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { ConfiguracionComponent } from './configuracion.component';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd-module.module';
import { JuzgadosComponent } from '../../components/juzgados/juzgados.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ServidoresDataMinerComponent } from '../../components/server/servidores-data-miner/servidores-data-miner.component';
import { DataMinerFormComponent } from '../../components/server/data-miner-form/data-miner-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JuzgadosFormComponent } from '../../components/juzgados-form/juzgados-form.component';
import { PasswordMaskPipe } from '../../pipes/password-mask.pipe';

@NgModule({
  declarations: [
    ConfiguracionComponent,
    JuzgadosComponent,
    JuzgadosFormComponent,
    ServidoresDataMinerComponent,
    DataMinerFormComponent,
    PasswordMaskPipe,
  ],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    NgZorroAntdModule,
    ScrollingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [PasswordMaskPipe],
})
export class ConfiguracionModule {}
