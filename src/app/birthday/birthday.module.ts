import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BirthdayPageRoutingModule } from './birthday-routing.module';

import { BirthdayPage } from './birthday.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BirthdayPageRoutingModule
  ],
  declarations: [BirthdayPage]
})
export class BirthdayPageModule {}
