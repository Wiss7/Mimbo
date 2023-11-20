import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaseDetailsPageRoutingModule } from './case-details-routing.module';

import { CaseDetailsPage } from './case-details.page';
import { AngularCropperjsModule } from 'angular-cropperjs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CaseDetailsPageRoutingModule,
    AngularCropperjsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [CaseDetailsPage],
})
export class CaseDetailsPageModule {}
