import {
  Component,
  ViewChild,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
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
  show = false;
  constructor(
    private modalCtrl: ModalController,
    private cdRef: ChangeDetectorRef
  ) {}
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

  onSave() {
    let croppedImgB64String: string = this.angularCropper.cropper
      .getCroppedCanvas()
      .toDataURL('image/jpeg', 100 / 100);
    this.croppedImage = croppedImgB64String;
  }
}