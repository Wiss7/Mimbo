import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BodyLanguagePageRoutingModule } from './body-language-routing.module';

import { BodyLanguagePage } from './body-language.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BodyLanguagePageRoutingModule
  ],
  declarations: [BodyLanguagePage]
})
export class BodyLanguagePageModule {}
