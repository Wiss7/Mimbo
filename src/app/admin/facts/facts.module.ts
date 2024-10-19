import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FactsPageRoutingModule } from './facts-routing.module';

import { FactsPage } from './facts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FactsPageRoutingModule
  ],
  declarations: [FactsPage]
})
export class FactsPageModule {}
