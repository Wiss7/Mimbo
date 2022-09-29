import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdditDogPage } from './addit-dog.page';

const routes: Routes = [
  {
    path: '',
    component: AdditDogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdditDogPageRoutingModule {}
