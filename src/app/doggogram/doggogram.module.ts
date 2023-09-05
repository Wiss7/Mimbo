import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoggogramPageRoutingModule } from './doggogram-routing.module';

import { DoggogramPage } from './doggogram.page';
import { PostCardComponent } from '../shared/post-card/post-card.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoggogramPageRoutingModule,
    SharedModule,
  ],
  declarations: [DoggogramPage],
})
export class DoggogramPageModule {}
