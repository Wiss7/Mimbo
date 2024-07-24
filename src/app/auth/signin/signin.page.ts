import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LoginDTO } from '../auth.dto';
import { AuthService } from '../auth.service';
import { MessagingService } from 'src/app/shared/services/messaging.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit, OnDestroy {
  redirectURL: UrlTree;
  loginSub: Subscription;
  constructor(
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private messagingService: MessagingService
  ) {}

  ngOnInit() {}
  ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }
  onSubmit(form: NgForm) {
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
              this.messagingService.requestNotificationPermission();
              const params = this.route.snapshot.queryParams;
              if (params.redirectURL) {
                this.redirectURL = params.redirectURL;
              }

              if (this.redirectURL) {
                this.router
                  .navigateByUrl(this.redirectURL)
                  .catch(() => this.router.navigate(['home']));
              } else {
                this.router.navigate(['home']);
              }
            } else {
              loadingEl.dismiss();
              this.alertCtrl
                .create({
                  header: 'Login Failed',
                  message: resp.error,
                  buttons: [{ text: 'Dismiss' }],
                })
                .then((alerEl) => {
                  alerEl.present();
                });
            }
          },
          error: () => {
            loadingEl.dismiss();
          },
        });
      });
  }

  goToSignup() {
    this.router.navigateByUrl('/signup');
  }

  goToChangePassword() {
    this.router.navigateByUrl('/change-password');
  }
}
