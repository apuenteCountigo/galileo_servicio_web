import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NomencladoresComponent } from './nomencladores.component';

const routes: Routes = [{ path: '', component: NomencladoresComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NomencladoresRoutingModule { }
