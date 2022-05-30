import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VetsNearByPageRoutingModule } from './vets-near-by-routing.module';

import { VetsNearByPage } from './vets-near-by.page';
import { SharedModule } from '../shared/shared.module';
import { OpeningHoursComponent } from './opening-hours/opening-hours.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VetsNearByPageRoutingModule,
    SharedModule,
  ],
  declarations: [VetsNearByPage, OpeningHoursComponent],
})
export class VetsNearByPageModule {}
