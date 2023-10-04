import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MapModalComponent } from './map-modal/map-modal.component';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { FormsModule } from '@angular/forms';
import { CommentsModalComponent } from './comments-modal/comments-modal.component';
import { PostCardComponent } from './post-card/post-card.component';
import { EditCommentModalComponent } from './post-card/edit-comment-modal/edit-comment-modal.component';
import { PhoneCodesComponent } from './phone-codes/phone-codes.component';
import { CaseCardComponent } from './case-card/case-card.component';
import { AuthPopupComponent } from './auth-popup/auth-popup.component';
@NgModule({
  declarations: [
    LocationPickerComponent,
    MapModalComponent,
    ImageCropperComponent,
    CommentsModalComponent,
    PostCardComponent,
    EditCommentModalComponent,
    PhoneCodesComponent,
    CaseCardComponent,
    AuthPopupComponent,
  ],
  exports: [
    LocationPickerComponent,
    MapModalComponent,
    PostCardComponent,
    CaseCardComponent,
    EditCommentModalComponent,
    AuthPopupComponent,
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    AngularCropperjsModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
