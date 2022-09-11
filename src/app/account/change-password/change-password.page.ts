import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ChangePasswordDTO } from 'src/app/auth/auth.dto';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit, OnDestroy {
  passwordsMatch = true;
  email: string;
  userSub: Subscription;
  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}
  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.email = user.email;
      }
    });
  }
  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
  updatePassword(form: NgForm) {
    const password = form.value.newPassword;
    const confirm = form.value.confirmPassword;
    const currentPass = form.value.currentPassword;
    if (password !== confirm) {
      this.passwordsMatch = false;
      return;
    }
    this.passwordsMatch = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        const dto: ChangePasswordDTO = {
          email: this.email,
          currentPassword: currentPass,
          newPassword: password,
        };
        this.authService.changePassword(dto).subscribe(
          (resp) => {
            if (resp) {
              loadingEl.dismiss();
              form.reset();
              this.alertCtrl
                .create({
                  header: 'Success',
                  message: 'Password Updated Successfully.',
                  buttons: [{ text: 'Dismiss' }],
                })
                .then((alertEl) => alertEl.present());
            } else {
              loadingEl.dismiss();
              this.alertCtrl
                .create({
                  header: 'Incorrect Password',
                  message:
                    'If you forgot your password, sign out and reset your password from the login page',
                  buttons: [{ text: 'Dismiss' }],
                })
                .then((alertEl) => alertEl.present());
            }
          },
          (err) => {
            loadingEl.dismiss();
          }
        );
      });
  }
}
