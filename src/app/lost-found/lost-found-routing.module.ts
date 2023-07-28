import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LostFoundPage } from './lost-found.page';

const routes: Routes = [
  {
    path: '',
    component: LostFoundPage
  },
  {
    path: 'add-case',
    loadChildren: () => import('./add-case/add-case.module').then( m => m.AddCasePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LostFoundPageRoutingModule {}
