import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import {
  ActionSheetController,
  AlertController,
  IonModal,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ImageCropperComponent } from 'src/app/shared/image-cropper/image-cropper.component';
import { PhoneCodesComponent } from 'src/app/shared/phone-codes/phone-codes.component';
import { CaseService } from '../case.service';
import { UpdateCaseDTO } from '../case.dto';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { Case } from '../case.model';
import { countrycodes } from 'src/app/shared/phone-codes/countrycodes';

@Component({
  selector: 'app-edit-case',
  templateUrl: './edit-case.component.html',
  styleUrls: ['./edit-case.component.scss'],
})
export class EditCaseComponent implements OnInit, OnDestroy {
  @Input() selectedCase: Case;
  caseType: string;
  updateCaseSub: Subscription;
  codeImage: string;
  selectedCode: string;
  selectedRegion = 'Lebanon';
  fullName: string;
  phoneNumber: string;
  region: string;
  details: string;
  userId: number;
  dogName: string;
  breed: string;
  age: number;
  medical: string;
  size: string = 'unknown';
  gender: string = 'unknown';
  images = [];
  selectedImage: string;
  termsAccepted = false;
  hideTermsMessage = true;
  email: string;
  imagesCount: number;
  @ViewChild('termsModal') termsModal: IonModal;
  constructor(
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private caseService: CaseService,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  toggleMessage() {
    if (this.termsAccepted) this.hideTermsMessage = true;
    else this.hideTermsMessage = false;
  }
  async ngOnInit() {
    this.userId = await this.isLoggedIn();
    this.caseType = this.selectedCase.type;
    this.fullName = this.selectedCase.fullName;
    this.email = this.selectedCase.email;
    this.phoneNumber = this.selectedCase.phoneNumber;
    this.selectedCode = this.selectedCase.phoneCode;
    this.selectedRegion = this.selectedCase.phoneRegion;
    this.codeImage = countrycodes.filter(
      (b) =>
        b.name.toLowerCase() === this.selectedRegion.toLowerCase() &&
        b.number === this.selectedCode
    )[0].flag;
    this.region = this.selectedCase.location;
    this.details = this.selectedCase.details;
    this.dogName = this.selectedCase.dogName;
    this.breed = this.selectedCase.breed;
    this.age = this.selectedCase.age;
    this.medical = this.selectedCase.medical;
    this.size = this.selectedCase.size;
    this.gender = this.selectedCase.gender;
    this.images = [...this.selectedCase.images];
    this.images.forEach((image) => {
      image.isAdded = 0;
      image.isDeleted = 0;
    });
    this.imagesCount = this.images.length;
  }
  ngOnDestroy(): void {
    if (this.updateCaseSub) this.updateCaseSub.unsubscribe();
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

  cancel() {
    this.termsModal.dismiss();
  }

  save() {
    if (!this.termsAccepted) {
      this.hideTermsMessage = false;
      return;
    }

    this.loadingCtrl
      .create({
        keyboardClose: true,
        showBackdrop: false,
        message: 'Please Wait...',
      })
      .then(async (loadingEl) => {
        loadingEl.present();
        debugger;
        const updateCaseDTO: UpdateCaseDTO = {
          id: this.selectedCase.id,
          details: this.details,
          email: this.email,
          location: this.region,
          phoneCode: this.selectedCode,
          phoneNumber: this.phoneNumber,
          phoneRegion: this.selectedRegion,
          type: this.caseType,
          images: [...this.images],
          userId: this.userId,
          age: this.age,
          breed: this.breed,
          dogName: this.dogName,
          gender: this.gender,
          medical: this.medical,
          size: this.size,
        };

        this.updateCaseSub = this.caseService
          .updateCase(updateCaseDTO)
          .subscribe({
            next: async (updatedCase) => {
              const toast = await this.toastController.create({
                color: 'primary',
                duration: 2000,
                message: 'Post added successfully',
              });
              loadingEl.dismiss();
              await toast.present();
              this.modalCtrl.dismiss({ updatedCase });
            },
            error: () => {
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
            },
          });
      });
  }
  async isLoggedIn() {
    const { value } = await Preferences.get({ key: 'authData' });
    if (value == null) {
      return -1;
    }
    const authData = JSON.parse(value);
    // if (authData.tokenExpirationDate <= new Date()) {
    //   return -1;
    // }
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
          const newImage = { id: -1, url: imageUrl, isDeleted: 0, isAdded: 1 };
          this.images.push(newImage);
          this.imagesCount++;
        });
        modalEl.present();
      });
  }

  removePhoto(index: number) {
    if (this.images[index].isAdded === 1) {
      this.images.splice(index, 1);
    } else {
      this.images[index].isDeleted = 1;
    }
    this.imagesCount--;
  }

  openTermsConditions() {
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

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
