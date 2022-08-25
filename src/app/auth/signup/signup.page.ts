import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { RegistrationDto } from '../auth.dto';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  passwordsMatch = true;
  redirectURL: UrlTree;
  constructor(
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}
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
        };
        this.authService.register(registerDTO).subscribe(
          (resp) => {
            if (resp.isRegistrationSuccessful) {
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
                  buttons: [{ text: 'Okay' }],
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
