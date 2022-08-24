import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { catchError, take, tap } from 'rxjs/operators';
import { Subscription, pipe } from 'rxjs';
import { UpdateProfileDTO, UpdateProfileResponseDTO } from '../auth/auth.dto';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
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
  deleteSub: Subscription;
  isUpdating = false;
  isDeleting = true;
  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private alertCtrl: AlertController
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
  logout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
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
        message: 'Updating Profile',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.updateSub = this.authService.updateProfile(dto).subscribe(
          async (res) => {
            const toast = await this.toastController.create({
              color: 'primary',
              duration: 2000,
              message: 'Updated successfully',
            });
            loadingEl.dismiss();
            await toast.present();
          },
          (err) => {
            loadingEl.dismiss();
          }
        );
      });
  }

  deleteProfile() {
    this.alertCtrl
      .create({
        header: 'Delete Account?',
        message:
          'Are you sure you wish to delete your account? This action cannot be undone!',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              this.alertCtrl.dismiss();
            },
          },
          {
            text: 'Delete',
            cssClass: 'confirm-delete',
            handler: () => {
              this.performDelete();
              this.alertCtrl.dismiss();
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  performDelete() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        showBackdrop: false,
        message: 'Deleting...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.deleteSub = this.authService.deleteProfile(this.userId).subscribe(
          async (res) => {
            loadingEl.dismiss();
            if (res) {
              this.logout();
              const toast = await this.toastController.create({
                color: 'primary',
                duration: 2000,
                message: 'Account Deleted Successfully!',
              });
              await toast.present();
            } else {
              this.alertCtrl
                .create({
                  header: 'An Error Occured',
                  message:
                    'We cannot perform this action at the moment. Please try again later.',
                  buttons: [
                    {
                      text: 'Okay',
                      handler: () => {
                        this.alertCtrl.dismiss();
                      },
                    },
                  ],
                })
                .then((alertEl) => alertEl.present());
            }
          },
          (err) => loadingEl.dismiss()
        );
      });
  }
}
