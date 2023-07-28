import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LostFoundPageRoutingModule } from './lost-found-routing.module';

import { LostFoundPage } from './lost-found.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LostFoundPageRoutingModule
  ],
  declarations: [LostFoundPage]
})
export class LostFoundPageModule {}
