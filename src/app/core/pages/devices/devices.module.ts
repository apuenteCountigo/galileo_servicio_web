import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevicesRoutingModule } from './devices-routing.module';
import { DevicesComponent } from './devices.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd-module.module';
import { DispositivosComponent } from '../../components/dispositivos/dispositivos.component';

@NgModule({
  declarations: [DevicesComponent, DispositivosComponent],
  imports: [
    CommonModule,
    DevicesRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [DispositivosComponent],
})
export class DevicesModule {}
