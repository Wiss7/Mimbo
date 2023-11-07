import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MycasesPageRoutingModule } from './mycases-routing.module';

import { MycasesPage } from './mycases.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MycasesPageRoutingModule,
    SharedModule,
  ],
  declarations: [MycasesPage],
})
export class MycasesPageModule {}
