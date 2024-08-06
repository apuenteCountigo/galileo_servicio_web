import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationsLayoutComponent } from './operations-layout/operations-layout.component';
import { OperationsRoutingModule } from './operations-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd-module.module';

@NgModule({
  declarations: [OperationsLayoutComponent],
  imports: [
    CommonModule,
    OperationsRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class OperationsModule {}
