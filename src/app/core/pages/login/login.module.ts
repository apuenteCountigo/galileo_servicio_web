import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NotificationService } from '../../services/notification.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NzSpinModule,
  ],
  providers: [NotificationService],
})
export class LoginModule {}
