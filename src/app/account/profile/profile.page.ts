import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';
import { catchError, take, tap } from 'rxjs/operators';
import { Subscription, pipe } from 'rxjs';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { UpdateProfileDTO } from '../../auth/auth.dto';
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
  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController
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
}
