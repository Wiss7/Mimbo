import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Share } from '@capacitor/share';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
  deleteSub: Subscription;
  userSub: Subscription;
  isDeleting = true;
  userId: number;
  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });
  }
  async shareApp() {
    await Share.share({
      title: 'See cool stuff',
      text: 'Are you a doggo mom or dad? Check out this really cool app ',
      url: 'https://play.google.com/store/apps/details?id=com.mimbo.app',
      dialogTitle: 'Share with buddies',
    }).then((res) => console.log(res));
  }
  logout() {
    this.authService.logout();
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
                      text: 'Dismiss',
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

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
  }
}
