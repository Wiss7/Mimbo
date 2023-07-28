import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FirstAidInfoPageRoutingModule } from './first-aid-info-routing.module';

import { FirstAidInfoPage } from './first-aid-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FirstAidInfoPageRoutingModule
  ],
  declarations: [FirstAidInfoPage]
})
export class FirstAidInfoPageModule {}
