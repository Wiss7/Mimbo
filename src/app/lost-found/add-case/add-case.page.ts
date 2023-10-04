import { Component, OnDestroy, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ImageCropperComponent } from 'src/app/shared/image-cropper/image-cropper.component';
import { PhoneCodesComponent } from 'src/app/shared/phone-codes/phone-codes.component';
import { CaseService } from '../case.service';
import { AddCaseDTO } from '../case.dto';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-case',
  templateUrl: './add-case.page.html',
  styleUrls: ['./add-case.page.scss'],
})
export class AddCasePage implements OnInit, OnDestroy {
  caseType: string;
  addCaseSub: Subscription;
  codeImage =
    'https://upload.wikimedia.org/wikipedia/commons/5/59/Flag_of_Lebanon.svg';
  selectedCode = '+961';
  selectedRegion = 'Lebanon';

  phoneNumber: string;
  region: string;
  details: string;
  images = [];
  selectedImage: string;
  constructor(
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private caseService: CaseService,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {}
  ngOnDestroy(): void {
    if (this.addCaseSub) this.addCaseSub.unsubscribe();
  }
  changeCountryCode() {
    this.modalCtrl
      .create({
        component: PhoneCodesComponent,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resData) => {
        if (resData.role === 'select') {
          const country = resData.data.country;
          this.selectedCode = country.number;
          this.selectedRegion = country.name;
          this.codeImage = country.flag;
        }
      });
  }

  save() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        showBackdrop: false,
        message: 'Please Wait...',
      })
      .then(async (loadingEl) => {
        loadingEl.present();
        const userId = await this.isLoggedIn();
        const addCaseDTO: AddCaseDTO = {
          details: this.details,
          location: this.region,
          phoneCode: this.selectedCode,
          phoneNumber: this.phoneNumber,
          phoneRegion: this.selectedRegion,
          type: this.caseType,
          images: [...this.images],
          userId,
        };

        this.addCaseSub = this.caseService.addCase(addCaseDTO).subscribe({
          next: async (isAdded) => {
            if (!isAdded) {
              loadingEl.dismiss();
              this.alertCtrl
                .create({
                  header: 'An Error Occurred',
                  message:
                    'Could not perform this action at the moment. Please try again later.',
                  buttons: [{ text: 'Dismiss' }],
                })
                .then((alerEl) => {
                  loadingEl.dismiss();
                  alerEl.present();
                });
            } else {
              const toast = await this.toastController.create({
                color: 'primary',
                duration: 2000,
                message: 'Post added successfully',
              });
              loadingEl.dismiss();
              await toast.present();
              this.router.navigate(['lost-found']);
            }
          },
          error: () => loadingEl.dismiss(),
        });
      });
  }
  async isLoggedIn() {
    const { value } = await Preferences.get({ key: 'authData' });
    if (value == null) {
      return -1;
    }
    const authData = JSON.parse(value);
    if (authData.tokenExpirationDate <= new Date()) {
      return -1;
    }
    return authData.id;
  }
  addImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }
    this.actionSheetCtrl
      .create({
        header: 'Add Image',
        buttons: [
          {
            text: 'Take Photo',
            icon: 'camera',
            handler: () => {
              this.getImage('Camera');
            },
            cssClass: 'actionsheetbutton',
          },
          {
            text: 'Choose from Gallery',
            icon: 'image',
            handler: () => {
              this.getImage('Gallery');
            },
            cssClass: 'actionsheetbutton',
          },
          {
            text: 'Cancel',
            icon: 'close',
            handler: () => {},
            cssClass: 'actionsheetbutton',
          },
        ],
      })
      .then((actionSheetEl) => actionSheetEl.present());
  }

  getImage(from: string) {
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
        this.selectedImage = image.base64String;
        this.openImageCropper();
      })
      .catch((err) => {});
  }

  openImageCropper() {
    this.modalCtrl
      .create({
        component: ImageCropperComponent,
        componentProps: {
          uploadedImage: 'data:image/png;base64, ' + this.selectedImage,
        },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          var imageUrl = modalData.data['imageUrl'];
          this.images.push(imageUrl);
        });
        modalEl.present();
      });
  }

  removePhoto(index: number) {
    this.images.splice(index, 1);
  }
}
