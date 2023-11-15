import {
  Component,
  ViewChild,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CropperComponent } from 'angular-cropperjs';
@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css'],
})
export class ImageCropperComponent implements AfterViewInit {
  @ViewChild('angularCropper') public angularCropper: CropperComponent;
  @Input() uploadedImage;
  cropperOptions: any;
  croppedImage = null;
  scaleValX = 1;
  scaleValY = 1;
  IsCropped = false;
  show = false;
  Caption = '';
  hideCaption = false;
  constructor(
    private modalCtrl: ModalController,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {
    this.IsCropped = false;
    this.Caption = '';
    this.hideCaption =
      this.router.url.indexOf('lost-found') >= 0 ||
      this.router.url.indexOf('mycases') >= 0;
  }
  ngAfterViewInit() {
    this.cropperOptions = {
      dragMode: 'crop',
      aspectRatio: 1,
      autoCrop: true,
      movable: false,
      zoomable: true,
      scalable: true,
      autoCropArea: 1,
      responsive: true,
    };
    setTimeout(() => {
      this.show = true;
    }, 300);
    this.cdRef.detectChanges();
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  rotate() {
    this.angularCropper.cropper.rotate(90);
  }

  zoom(zoomIn: boolean) {
    let factor = zoomIn ? 0.1 : -0.1;
    this.angularCropper.cropper.zoom(factor);
  }

  scaleX() {
    this.scaleValX = this.scaleValX * -1;
    this.angularCropper.cropper.scaleX(this.scaleValX);
  }

  scaleY() {
    this.scaleValY = this.scaleValY * -1;
    this.angularCropper.cropper.scaleY(this.scaleValY);
  }

  onSaveCrop() {
    let croppedImgB64String: string = this.angularCropper.cropper
      .getCroppedCanvas()
      .toDataURL('image/jpeg', 100 / 100);
    this.croppedImage = croppedImgB64String;
    this.IsCropped = true;
  }

  BackToCrop() {
    this.IsCropped = false;
  }

  UploadImage() {
    this.modalCtrl.dismiss({
      imageUrl: this.croppedImage,
      caption: this.Caption,
    });
  }
}
