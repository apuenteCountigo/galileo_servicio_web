import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd-module.module';
import { UserFormComponent } from 'src/app/core/components/user/user-form/user-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { UnidadModule } from '../unidad/unidad.module';
import { SelectUnidadesComponent } from '../../components/user/select-unidades/select-unidades.component';
import { UnidadAsociadaComponent } from '../../components/user/unidad-asociada/unidad-asociada.component';
import { UserMainTableComponent } from '../../components/user/user-main-table/user-main-table.component';
import { UserService } from '../../services/user.service';

@NgModule({
  declarations: [
    UsersComponent,
    UserFormComponent,
    SelectUnidadesComponent,
    UnidadAsociadaComponent,
    UserMainTableComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    UnidadModule,
  ],
  providers: [NotificationService, UserService],
})
export class UsersModule {}
