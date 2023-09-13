import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MypostsPageRoutingModule } from './myposts-routing.module';

import { MypostsPage } from './myposts.page';
import { PostCardComponent } from 'src/app/shared/post-card/post-card.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MypostsPageRoutingModule,
    SharedModule,
  ],
  declarations: [MypostsPage],
})
export class MypostsPageModule {}
