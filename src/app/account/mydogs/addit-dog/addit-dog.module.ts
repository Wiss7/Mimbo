import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdditDogPageRoutingModule } from './addit-dog-routing.module';

import { AdditDogPage } from './addit-dog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdditDogPageRoutingModule
  ],
  declarations: [AdditDogPage]
})
export class AdditDogPageModule {}
