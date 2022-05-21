import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BreedsInfoPage } from './breeds-info.page';

const routes: Routes = [
  {
    path: '',
    component: BreedsInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BreedsInfoPageRoutingModule {}
