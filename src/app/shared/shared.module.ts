import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MapModalComponent } from './map-modal/map-modal.component';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { FormsModule } from '@angular/forms';
import { CommentsModalComponent } from './comments-modal/comments-modal.component';
import { PostCardComponent } from './post-card/post-card.component';
@NgModule({
  declarations: [
    LocationPickerComponent,
    MapModalComponent,
    ImageCropperComponent,
    CommentsModalComponent,
    PostCardComponent,
  ],
  exports: [LocationPickerComponent, MapModalComponent, PostCardComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    AngularCropperjsModule,
    FormsModule,
  ],
})
export class SharedModule {}
