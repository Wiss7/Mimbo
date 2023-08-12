import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EdiblePageRoutingModule } from './edible-routing.module';

import { EdiblePage } from './edible.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EdiblePageRoutingModule,
    RouterModule,
  ],
  declarations: [EdiblePage],
})
export class EdiblePageModule {}
