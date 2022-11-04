import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonModal,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DogService } from '../dogs.service';
import { AddDogDTO, UpdateDogDTO } from '../mydogs.dto';
@Component({
  selector: 'app-addit-dog',
  templateUrl: './addit-dog.page.html',
  styleUrls: ['./addit-dog.page.scss'],
})
export class AdditDogPage implements OnInit, OnDestroy {
  @ViewChild('genderpopup') genderModal: IonModal;
  @ViewChild('dobpopup') dobModal: IonModal;
  @ViewChild('breedpopup') breedModal: IonModal;
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
  userSub: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private dogService: DogService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private router: Router
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
      this.dogService.getDogById(this.dogId).subscribe((dog) => {
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
      });
    } else {
      this.title = 'Add New Dog';
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    if (this.addSub) {
      this.addSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
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
            id: this.dogId,
          };
          this.addSub = this.dogService.updateDog(updateDogDTO).subscribe(
            async (res) => {
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
                  message: 'Updated successfully',
                });
                loadingEl.dismiss();
                await toast.present();
                this.router.navigate(['account', 'mydogs']);
              }
            },
            () => loadingEl.dismiss()
          );
        } else {
          const addDogDTO: AddDogDTO = {
            name: this.name,
            breed: this.breed,
            dateOfBirth: this.dob,
            gender: this.gender,
            userId: this.userId,
          };
          this.addSub = this.dogService.addDog(addDogDTO).subscribe(
            async (res) => {
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
                  message: 'Added successfully',
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
            () => loadingEl.dismiss()
          );
        }
      });
  }
}
