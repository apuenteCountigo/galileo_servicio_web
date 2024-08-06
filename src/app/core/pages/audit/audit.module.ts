import { UserTracePipe } from './../../pipes/user-trace.pipe';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AuditRoutingModule } from './audit-routing.module';
import { AuditComponent } from './audit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd-module.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [AuditComponent, UserTracePipe],
  imports: [
    CommonModule,
    AuditRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPermissionsModule.forChild(),
  ],
  providers: [DatePipe, UserTracePipe],
})
export class AuditModule {}
