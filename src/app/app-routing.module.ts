import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./core/pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./core/pages/layout/layout.module').then((m) => m.LayoutModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'app/configuracion',
    canActivate: [AuthGuard],
  },
  { path: 'audit', loadChildren: () => import('./core/pages/audit/audit.module').then(m => m.AuditModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
