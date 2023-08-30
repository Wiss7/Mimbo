import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit, OnDestroy {
  resetSub: Subscription;
  constructor(
    private alertCtrl: AlertController,
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}
  ngOnDestroy() {
    if (this.resetSub) {
      this.resetSub.unsubscribe();
    }
  }
  resetPassword(email) {
    if (email.value && email.value.trim().length > 0) {
      const emailVal = email.value;
      email.value = '';
      this.loadingCtrl
        .create({
          keyboardClose: true,
          showBackdrop: false,
          message: 'Please wait...',
        })
        .then((loadingEl) => {
          loadingEl.present();
          this.resetSub = this.authService.resetPassword(emailVal).subscribe({
            next: (res) => {
              loadingEl.dismiss();
              if (res) {
                this.alertCtrl
                  .create({
                    message: 'You will receive further instruction via e-mail.',
                    buttons: [
                      {
                        text: 'Dismiss',
                        handler: () => {
                          this.router.navigate(['/signin']);
                        },
                      },
                    ],
                  })
                  .then((alertEl) => alertEl.present());
              } else {
                this.loadingCtrl.dismiss();
                this.alertCtrl
                  .create({
                    header: 'An Error Occured',
                    message:
                      'Make sure you entered the correct email or try again later.',
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
            error: () => loadingEl.dismiss(),
          });
        });
    } else {
      this.alertCtrl
        .create({
          message: 'Please enter a valid email to reset your password.',
          buttons: [{ text: 'Dismiss' }],
        })
        .then((alertEl) => alertEl.present());
    }
  }
}
