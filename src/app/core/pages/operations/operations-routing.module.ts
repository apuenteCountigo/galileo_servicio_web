import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationsLayoutComponent } from './operations-layout/operations-layout.component';

const routes: Routes = [{ path: '', component: OperationsLayoutComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule { }
