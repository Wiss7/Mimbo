import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingToolsPage } from './training-tools.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TrainingToolsPage,
    children: [
      {
        path: 'clicker',
        loadChildren: () =>
          import('./clicker/clicker.module').then((m) => m.ClickerPageModule),
      },
      {
        path: 'whistle',
        loadChildren: () =>
          import('./whistle/whistle.module').then((m) => m.WhistlePageModule),
      },
      {
        path: '',
        redirectTo: '/training-tools/tabs/clicker',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/training-tools/tabs/clicker',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingToolsPageRoutingModule {}
