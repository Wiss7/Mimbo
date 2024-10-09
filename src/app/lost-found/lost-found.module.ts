import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LostFoundPageRoutingModule } from './lost-found-routing.module';

import { LostFoundPage } from './lost-found.page';
import { SharedModule } from '../shared/shared.module';
import { EditCaseComponent } from './edit-case/edit-case.component';
import { FilterDeletedPipe } from './filterdeleted.pipe';
import { CasesFilterPipe } from './cases-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LostFoundPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    LostFoundPage,
    EditCaseComponent,
    FilterDeletedPipe,
    CasesFilterPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LostFoundPageModule {}
