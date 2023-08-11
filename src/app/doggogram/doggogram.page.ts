import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Camera } from '@capacitor/camera';
import {
  CameraResultType,
  CameraSource,
} from '@capacitor/camera/dist/esm/definitions';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-doggogram',
  templateUrl: './doggogram.page.html',
  styleUrls: ['./doggogram.page.scss'],
})
export class DoggogramPage implements OnInit {
  @Output() imagePicked = new EventEmitter<string>();
  uploadedImage: string;

  constructor() {}

  ngOnInit() {}

  onPickImageFromCamera() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }
    Camera.getPhoto({
      quality: 70,
      source: CameraSource.Camera,
      correctOrientation: true,
      resultType: CameraResultType.Base64,
      width: 800,
      height: 800,
      allowEditing: true,
    })
      .then((image) => {
        this.uploadedImage = image.base64String;
        this.imagePicked.emit(image.base64String);
        console.log(image.base64String);
      })
      .catch((err) => {});
  }

  onPickImageFromGallery() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }
    Camera.getPhoto({
      quality: 70,
      source: CameraSource.Photos,
      correctOrientation: true,
      resultType: CameraResultType.Base64,
      width: 800,
      height: 800,
    })
      .then((image) => {
        this.uploadedImage = image.base64String;
        this.imagePicked.emit(image.base64String);
        console.log(image.base64String);
      })
      .catch((err) => {});
  }
}
