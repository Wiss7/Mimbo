import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WhistlePageRoutingModule } from './whistle-routing.module';

import { WhistlePage } from './whistle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WhistlePageRoutingModule
  ],
  declarations: [WhistlePage]
})
export class WhistlePageModule {}
