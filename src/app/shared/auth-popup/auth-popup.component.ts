import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LoginDTO } from 'src/app/auth/auth.dto';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-auth-popup',
  templateUrl: './auth-popup.component.html',
  styleUrls: ['./auth-popup.component.scss'],
})
export class AuthPopupComponent implements OnInit, OnDestroy {
  loginSub: Subscription;
  loginFail = false;
  constructor(
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit() {}
  ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }
  onSubmit(form: NgForm) {
    this.loginFail = false;
    if (!form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Please wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        const loginDto: LoginDTO = {
          username: form.value.email,
          password: form.value.password,
        };
        this.loginSub = this.authService.login(loginDto).subscribe({
          next: (resp) => {
            if (resp.isLoginSuccessful) {
              loadingEl.dismiss();
              this.modalCtrl.dismiss({ userId: resp.userId });
            } else {
              loadingEl.dismiss();
              this.loginFail = true;
            }
          },
          error: () => {
            loadingEl.dismiss();
          },
        });
      });
  }

  goToSignup() {
    this.modalCtrl.dismiss();
    this.router.navigateByUrl('/signup');
  }

  goToChangePassword() {
    this.modalCtrl.dismiss();
    this.router.navigateByUrl('/change-password');
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
