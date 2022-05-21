import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BreedsInfoPageRoutingModule } from './breeds-info-routing.module';

import { BreedsInfoPage } from './breeds-info.page';
import { BreedListComponent } from './breed-list/breed-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BreedsInfoPageRoutingModule,
  ],
  declarations: [BreedsInfoPage, BreedListComponent],
})
export class BreedsInfoPageModule {}
