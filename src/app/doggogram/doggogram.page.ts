import { Component, OnInit } from '@angular/core';
import { Camera } from '@capacitor/camera';
import {
  CameraResultType,
  CameraSource,
} from '@capacitor/camera/dist/esm/definitions';

import { Capacitor } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { ImageCropperComponent } from '../shared/image-cropper/image-cropper.component';

@Component({
  selector: 'app-doggogram',
  templateUrl: './doggogram.page.html',
  styleUrls: ['./doggogram.page.scss'],
})
export class DoggogramPage implements OnInit {
  uploadedImage: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onPickImageFromCamera(from: string) {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }

    let source: any;
    if (from === 'Camera') {
      source = CameraSource.Camera;
    } else {
      source = CameraSource.Photos;
    }

    Camera.getPhoto({
      quality: 70,
      source,
      correctOrientation: true,
      resultType: CameraResultType.Base64,
      allowEditing: false,
    })
      .then((image) => {
        this.uploadedImage = image.base64String;
        this.openImageCropper();
      })
      .catch((err) => {});
  }

  openImageCropper() {
    this.modalCtrl
      .create({
        component: ImageCropperComponent,
        componentProps: {
          uploadedImage: 'data:image/png;base64, ' + this.uploadedImage,
        },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
        });
        modalEl.present();
      });
  }
}
