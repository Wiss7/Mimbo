import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FirstAidPage } from './first-aid.page';

const routes: Routes = [
  {
    path: '',
    component: FirstAidPage
  },
  {
    path: 'first-aid-info',
    loadChildren: () => import('./first-aid-info/first-aid-info.module').then( m => m.FirstAidInfoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FirstAidPageRoutingModule {}
