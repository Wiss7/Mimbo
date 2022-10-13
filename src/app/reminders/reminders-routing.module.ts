import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RemindersPage } from './reminders.page';

const routes: Routes = [
  {
    path: '',
    component: RemindersPage,
  },
  {
    path: 'addit-reminders',
    loadChildren: () =>
      import('./addit-reminders/addit-reminders.module').then(
        (m) => m.AdditRemindersPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemindersPageRoutingModule {}
