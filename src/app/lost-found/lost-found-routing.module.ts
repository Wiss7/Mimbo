import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LostFoundPage } from './lost-found.page';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LostFoundPage,
  },
  {
    path: 'add-case',
    loadChildren: () =>
      import('./add-case/add-case.module').then((m) => m.AddCasePageModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LostFoundPageRoutingModule {}
