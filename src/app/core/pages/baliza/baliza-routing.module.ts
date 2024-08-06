import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalizaComponent } from './baliza.component';

const routes: Routes = [{ path: '', component: BalizaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalizaRoutingModule { }
