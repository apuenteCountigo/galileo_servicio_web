import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'welcome',
        loadChildren: () =>
          import('../welcome/welcome.module').then((m) => m.WelcomeModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('../users/users.module').then((m) => m.UsersModule),
        canActivate: [AuthGuard],
        data: { expectedRole: ['Super Administrador','Administrador de Unidad'] }
      },
      {
        path: 'unidad',
        loadChildren: () =>
          import('../unidad/unidad.module').then((m) => m.UnidadModule),
      },
      {
        path: 'baliza',
        loadChildren: () =>
          import('../baliza/baliza.module').then((m) => m.BalizaModule),
        canActivate: [AuthGuard],
        data: { expectedRole: ['Super Administrador','Administrador de Unidad'] }
      },
      {
        path: 'nomencladores',
        loadChildren: () =>
          import('../nomencladores/nomencladores.module').then(
            (m) => m.NomencladoresModule
          ),
          canActivate: [AuthGuard],
          data: { expectedRole: ['Super Administrador','Administrador de Unidad'] }
      },
      {
        path: 'devices',
        loadChildren: () =>
          import('../devices/devices.module').then((m) => m.DevicesModule),
      },
      {
        path: 'operacion',
        loadChildren: () =>
          import('../operacion/operacion.module').then(
            (m) => m.OperacionModule
          ),
      },
      {
        path: 'configuracion',
        loadChildren: () =>
          import('../configuracion/configuracion.module').then(
            (m) => m.ConfiguracionModule
          ),
          canActivate: [AuthGuard],
          data: { expectedRole: ['Super Administrador','Administrador de Unidad'] }
      },
      {
        path: 'operations',
        loadChildren: () =>
          import('../operations/operations.module').then(
            (m) => m.OperationsModule
          ),
      },
      {
        path: 'audit',
        loadChildren: () =>
          import('../audit/audit.module').then(
            (m) => m.AuditModule
          ),
          canActivate: [AuthGuard],
          data: { expectedRole: ['Super Administrador','Administrador de Unidad'] }
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
