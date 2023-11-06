import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LostFoundPageRoutingModule } from './lost-found-routing.module';

import { LostFoundPage } from './lost-found.page';
import { SharedModule } from '../shared/shared.module';
import { CaseDetailsComponent } from './case-details/case-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LostFoundPageRoutingModule,
    SharedModule,
  ],
  declarations: [LostFoundPage, CaseDetailsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LostFoundPageModule {}
