import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingToolsPageRoutingModule } from './training-tools-routing.module';

import { TrainingToolsPage } from './training-tools.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingToolsPageRoutingModule
  ],
  declarations: [TrainingToolsPage]
})
export class TrainingToolsPageModule {}
