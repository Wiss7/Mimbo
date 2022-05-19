import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EdiblePage } from './edible.page';

const routes: Routes = [
  {
    path: '',
    component: EdiblePage,
  },
  {
    path: 'details/:name',
    loadChildren: () =>
      import('./details/details.module').then((m) => m.DetailsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EdiblePageRoutingModule {}
