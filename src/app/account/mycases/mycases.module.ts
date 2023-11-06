import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MycasesPageRoutingModule } from './mycases-routing.module';

import { MycasesPage } from './mycases.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MycasesPageRoutingModule
  ],
  declarations: [MycasesPage]
})
export class MycasesPageModule {}
