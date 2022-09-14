import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MydogsPageRoutingModule } from './mydogs-routing.module';

import { MydogsPage } from './mydogs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MydogsPageRoutingModule
  ],
  declarations: [MydogsPage]
})
export class MydogsPageModule {}
