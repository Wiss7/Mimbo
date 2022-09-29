import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MydogsPage } from './mydogs.page';

const routes: Routes = [
  {
    path: '',
    component: MydogsPage,
  },
  {
    path: 'addit-dog/:id',
    loadChildren: () =>
      import('./addit-dog/addit-dog.module').then((m) => m.AdditDogPageModule),
  },
  {
    path: 'addit-dog',
    loadChildren: () =>
      import('./addit-dog/addit-dog.module').then((m) => m.AdditDogPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MydogsPageRoutingModule {}
