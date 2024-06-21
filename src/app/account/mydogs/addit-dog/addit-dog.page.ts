import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonModal,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DogService } from '../dogs.service';
import { AddDogDTO, UpdateDogDTO } from '../mydogs.dto';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImageCropperComponent } from 'src/app/shared/image-cropper/image-cropper.component';
@Component({
  selector: 'app-addit-dog',
  templateUrl: './addit-dog.page.html',
  styleUrls: ['./addit-dog.page.scss'],
})
export class AdditDogPage implements OnInit, OnDestroy {
  @ViewChild('genderpopup') genderModal: IonModal;
  @ViewChild('dobpopup') dobModal: IonModal;
  @ViewChild('breedpopup') breedModal: IonModal;
  isActionSheetOpen = false;
  showImage = false;
  imageSrc = 'https://freesvg.org/img/DogProfile.png';
  uploadedImage: string;
  //https://codepen.io/rdelafuente/pen/xxqMXX
  public actionSheetButtons = [
    {
      text: 'View Picture',
      icon: 'eye-outline',
      handler: () => {
        this.viewImage();
      },
    },
    {
      text: 'Choose from gallery',
      icon: 'image-outline',
      handler: () => {
        this.onPickImageFromCamera('Gallery');
      },
    },
    {
      text: 'Take new picture',
      icon: 'camera-outline',
      handler: () => {
        this.onPickImageFromCamera('Camera');
      },
    },
    {
      text: 'Remove current picture',
      icon: 'trash-outline',
      handler: () => {
        this.uploadedImage = this.imageSrc;
      },
    },
  ];

  viewImage() {
    this.showImage = true;
  }
  closeImage() {
    this.showImage = false;
  }
  setOpen(isOpen: boolean) {
    this.isActionSheetOpen = isOpen;
  }
  title = 'Add New Dog';
  isLoading = true;
  name: string;
  dob: string;
  dobPopupVal: Date;
  gender: string;
  breed: string;
  dateToday: string;
  genderPopupVal = '';
  dogId = 0;
  userId: number;
  addSub: Subscription;
  updateSub: Subscription;
  getSub: Subscription;
  userSub: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private dogService: DogService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private modalCtrl: ModalController
  ) {}
  ngOnInit(): void {}
  ionViewWillEnter() {
    this.dateToday = new Date().toISOString();
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });
    this.dogId = +this.activatedRoute.snapshot.params.id;
    if (this.dogId > 0) {
      this.title = 'Edit';
      this.getSub = this.dogService.getDogById(this.dogId).subscribe((dog) => {
        this.name = dog.name;
        this.breed = dog.breed;
        this.gender = dog.gender;
        this.genderPopupVal = dog.gender;
        const format = 'dd/MM/yyyy';
        const locale = 'en-US';
        this.dob = formatDate(dog.dateOfBirth, format, locale);
        this.dobPopupVal = dog.dateOfBirth;
        this.title = `Edit ${this.name}'s Info`;
        this.isLoading = false;
        if (dog.imageUrl.length > 0) {
          this.uploadedImage = dog.imageUrl;
        } else {
          this.uploadedImage = this.imageSrc;
        }
      });
    } else {
      this.title = 'Add New Dog';
      this.isLoading = false;
      this.uploadedImage = this.imageSrc;
    }
  }

  ngOnDestroy() {
    if (this.addSub) {
      this.addSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
    if (this.getSub) {
      this.getSub.unsubscribe();
    }
  }

  cancelDOB() {
    this.dobModal.dismiss(null, 'cancel');
  }

  cancelGender() {
    this.genderModal.dismiss(null, 'cancel');
  }

  setGender() {
    this.genderModal.dismiss(this.genderPopupVal, 'confirm');
  }

  setDOB() {
    this.dobModal.dismiss(this.dobPopupVal, 'confirm');
  }

  onGenderWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.gender = ev.detail.data;
    }
  }
  onDOBWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      let myDate;
      if (ev.detail.data) {
        myDate = ev.detail.data;
      } else {
        myDate = new Date().toISOString();
      }
      const format = 'dd/MM/yyyy';
      const locale = 'en-US';
      this.dob = formatDate(myDate, format, locale);
    }
  }

  async onPickImageFromCamera(from: string) {
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
          this.uploadedImage = modalData.data['imageUrl'];
        });
        modalEl.present();
      });
  }

  save() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Please wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        if (this.dogId > 0) {
          const updateDogDTO: UpdateDogDTO = {
            name: this.name,
            breed: this.breed,
            dateOfBirth: this.dob,
            gender: this.gender,
            imageUrl: this.uploadedImage,
            id: this.dogId,
          };
          this.updateSub = this.dogService.updateDog(updateDogDTO).subscribe({
            next: async (res) => {
              if (!res) {
                loadingEl.dismiss();
                this.alertCtrl
                  .create({
                    header: 'An Error Occurred',
                    message:
                      'Could not perform this action at the moment. Please try again later.',
                    buttons: [{ text: 'Dismiss' }],
                  })
                  .then((alerEl) => {
                    alerEl.present();
                  });
              } else {
                const toast = await this.toastController.create({
                  color: 'primary',
                  duration: 2000,
                  message: 'Dog updated successfully',
                });
                loadingEl.dismiss();
                await toast.present();
                this.router.navigate(['account', 'mydogs']);
              }
            },
            error: () => loadingEl.dismiss(),
          });
        } else {
          const addDogDTO: AddDogDTO = {
            name: this.name,
            breed: this.breed,
            dateOfBirth: this.dob,
            gender: this.gender,
            userId: this.userId,
            imageUrl: this.uploadedImage,
          };
          this.addSub = this.dogService.addDog(addDogDTO).subscribe({
            next: async (res) => {
              if (!res.isDogAdded) {
                loadingEl.dismiss();
                this.alertCtrl
                  .create({
                    header: 'An Error Occurred',
                    message:
                      'Could not perform this action at the moment. Please try again later.',
                    buttons: [{ text: 'Dismiss' }],
                  })
                  .then((alerEl) => {
                    alerEl.present();
                  });
              } else {
                const toast = await this.toastController.create({
                  color: 'primary',
                  duration: 2000,
                  message: 'Dog added successfully',
                });
                loadingEl.dismiss();
                await toast.present();
                if (
                  this.activatedRoute.snapshot.queryParamMap.get(
                    'fromReminder'
                  ) === '1'
                ) {
                  this.router.navigate(['/reminders/addit-reminders']);
                } else {
                  this.router.navigate(['account', 'mydogs']);
                }
              }
            },
            error: () => loadingEl.dismiss(),
          });
        }
      });
  }
}
