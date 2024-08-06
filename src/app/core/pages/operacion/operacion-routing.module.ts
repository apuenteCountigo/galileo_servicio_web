import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperacionComponent } from './operacion.component';

const routes: Routes = [{ path: '', component: OperacionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionRoutingModule { }
