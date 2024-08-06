import { BreadCrumbComponent } from './../../components/bread-crumb/bread-crumb.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd-module.module';
import { UnitTreeComponent } from '../../components/unit-tree/unit-tree.component';
import { ChangePasswordComponent } from '../../components/user/change-password/change-password.component';
import { NotificationService } from '../../services/notification.service';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [LayoutComponent, UnitTreeComponent, ChangePasswordComponent, BreadCrumbComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzTableModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    LayoutRoutingModule,
    NgxPermissionsModule.forChild(),
  ],
  providers: [NotificationService],
})
export class LayoutModule {}
