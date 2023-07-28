import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FirstAidInfoPage } from './first-aid-info.page';

const routes: Routes = [
  {
    path: '',
    component: FirstAidInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FirstAidInfoPageRoutingModule {}
