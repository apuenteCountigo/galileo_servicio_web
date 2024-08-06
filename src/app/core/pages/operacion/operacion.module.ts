import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperacionRoutingModule } from './operacion-routing.module';
import { OperacionComponent } from './operacion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd-module.module';
import { NotificationService } from '../../services/notification.service';

@NgModule({
  declarations: [
    OperacionComponent, 
    //OperacionesFormComponent
  ],
  imports: [
    CommonModule,
    OperacionRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [NotificationService],
})
export class OperacionModule {}
