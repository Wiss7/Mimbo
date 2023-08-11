import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoggogramPage } from './doggogram.page';

const routes: Routes = [
  {
    path: '',
    component: DoggogramPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoggogramPageRoutingModule {}
