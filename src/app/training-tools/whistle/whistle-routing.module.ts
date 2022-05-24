import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WhistlePage } from './whistle.page';

const routes: Routes = [
  {
    path: '',
    component: WhistlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhistlePageRoutingModule {}
