import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MapModalComponent } from './map-modal/map-modal.component';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    LocationPickerComponent,
    MapModalComponent,
    ImageCropperComponent,
  ],
  exports: [LocationPickerComponent, MapModalComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    AngularCropperjsModule,
    FormsModule,
  ],
})
export class SharedModule {}
