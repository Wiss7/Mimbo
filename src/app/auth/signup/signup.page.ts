import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { RegistrationDto } from '../auth.dto';
import { AuthService } from '../auth.service';
import { countrycodes } from '../../shared/phone-codes/countrycodes';
import { PhoneCodesComponent } from 'src/app/shared/phone-codes/phone-codes.component';
import { MessagingService } from 'src/app/shared/services/messaging.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, OnDestroy {
  passwordsMatch = true;
  countrycodes = [];
  redirectURL: UrlTree;
  registerSub: Subscription;
  codeImage =
    'https://upload.wikimedia.org/wikipedia/commons/5/59/Flag_of_Lebanon.svg';
  selectedCode = '+961';
  selectedRegion = 'Lebanon';
  constructor(
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private messagingService: MessagingService
  ) {
    this.countrycodes = countrycodes;
  }

  ngOnInit() {}
  ngOnDestroy() {
    if (this.registerSub) {
      this.registerSub.unsubscribe();
    }
  }
  goToSignin() {
    this.router.navigateByUrl('/signin');
  }

  onRegister(form: NgForm) {
    const password = form.value.password;
    const confirm = form.value.confirmPassword;
    if (password !== confirm) {
      this.passwordsMatch = false;
      return;
    }
    this.passwordsMatch = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        const registerDTO: RegistrationDto = {
          email: form.value.email.replace(/\s/g, '').toLowerCase(),
          username: form.value.username.replace(/\s/g, '').toLowerCase(),
          password: form.value.password,
          confirmPassword: form.value.confirmPassword,
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          phoneCode: this.selectedCode,
          phoneRegion: this.selectedRegion,
          phoneNumber: form.value.phone,
        };
        this.registerSub = this.authService.register(registerDTO).subscribe({
          next: (resp) => {
            if (resp.isRegistrationSuccessful) {
              this.messagingService.requestNotificationPermission();
              loadingEl.dismiss();
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
                  header: 'Registration Failed',
                  message: resp.error,
                  buttons: [{ text: 'Dismiss' }],
                })
                .then((alertEl) => alertEl.present());
            }
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
