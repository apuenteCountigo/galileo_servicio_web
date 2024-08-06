import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BalizaRoutingModule } from './baliza-routing.module';
import { BalizaComponent } from './baliza.component';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd-module.module';
import { StockTableComponent } from '../../components/baliza/stock-table/stock-table.component';
import { AsignedTableComponent } from '../../components/baliza/asigned-table/asigned-table.component';
import { BalizaFormComponent } from '../../components/baliza/baliza-form/baliza-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { BalizaAsignComponent } from '../../components/baliza/baliza-asign/baliza-asign.component';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    BalizaComponent,
    StockTableComponent,
    AsignedTableComponent,
    BalizaFormComponent,
    BalizaAsignComponent,
  ],
  imports: [
    CommonModule,
    BalizaRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
  ],
  providers: [NotificationService, DatePipe],
  exports: [AsignedTableComponent],
})
export class BalizaModule {}
