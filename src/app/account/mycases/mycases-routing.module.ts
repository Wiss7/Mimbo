import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MycasesPage } from './mycases.page';

const routes: Routes = [
  {
    path: '',
    component: MycasesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MycasesPageRoutingModule {}
