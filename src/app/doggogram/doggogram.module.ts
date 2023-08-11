import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoggogramPageRoutingModule } from './doggogram-routing.module';

import { DoggogramPage } from './doggogram.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoggogramPageRoutingModule
  ],
  declarations: [DoggogramPage]
})
export class DoggogramPageModule {}
