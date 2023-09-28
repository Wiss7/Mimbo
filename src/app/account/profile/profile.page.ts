import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';
import { Subscription } from 'rxjs';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { UpdateProfileDTO } from '../../auth/auth.dto';
import { countrycodes } from 'src/app/shared/phone-codes/countrycodes';
import { PhoneCodesComponent } from 'src/app/shared/phone-codes/phone-codes.component';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  user: User;
  userId: number;
  userSub: Subscription;
  updateSub: Subscription;
  isUpdating = false;
  codeImage: string;
  selectedCode: string;
  selectedRegion: string;
  phoneNumber: string;
  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.user = user;
        this.email = user.email;
        this.username = user.username;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.userId = user.id;
        this.selectedCode = user.phoneCode;
        this.selectedRegion = user.phoneRegion;
        this.phoneNumber = user.phoneNumber;

        this.codeImage = countrycodes.filter((c) => {
          return (
            c.number === this.selectedCode && c.name === this.selectedRegion
          );
        })[0].flag;
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
  }
  updateProfile() {
    const dto: UpdateProfileDTO = {
      id: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      phoneCode: this.selectedCode,
      phoneRegion: this.selectedRegion,
      phoneNumber: this.phoneNumber,
    };
    this.loadingCtrl
      .create({
        keyboardClose: true,
        showBackdrop: false,
        message: 'Please Wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.updateSub = this.authService.updateProfile(dto).subscribe({
          next: async (res) => {
            const toast = await this.toastController.create({
              color: 'primary',
              duration: 2000,
              message: 'Profile updated successfully',
            });
            loadingEl.dismiss();
            await toast.present();
          },
          error: () => {
            loadingEl.dismiss();
          },
        });
      });
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
}
