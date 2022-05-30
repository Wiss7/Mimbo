import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VetsNearByPage } from './vets-near-by.page';

const routes: Routes = [
  {
    path: '',
    component: VetsNearByPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VetsNearByPageRoutingModule {}
