import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdditRemindersPage } from './addit-reminders.page';

const routes: Routes = [
  {
    path: '',
    component: AdditRemindersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdditRemindersPageRoutingModule {}
