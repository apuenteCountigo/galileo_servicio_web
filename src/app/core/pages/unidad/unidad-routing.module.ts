import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnidadComponent } from './unidad.component';

const routes: Routes = [{ path: '', component: UnidadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnidadRoutingModule { }
