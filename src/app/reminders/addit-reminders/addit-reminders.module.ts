import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdditRemindersPageRoutingModule } from './addit-reminders-routing.module';

import { AdditRemindersPage } from './addit-reminders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdditRemindersPageRoutingModule
  ],
  declarations: [AdditRemindersPage]
})
export class AdditRemindersPageModule {}
