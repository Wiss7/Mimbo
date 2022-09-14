import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MydogsPage } from './mydogs.page';

const routes: Routes = [
  {
    path: '',
    component: MydogsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MydogsPageRoutingModule {}
