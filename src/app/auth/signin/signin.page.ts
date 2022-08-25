import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LoginDTO } from '../auth.dto';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  redirectURL: UrlTree;
  constructor(
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

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
        this.authService.login(loginDto).subscribe(
          (resp) => {
            if (resp.isLoginSuccessful) {
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
                  header: 'Login Failed',
                  message: resp.error,
                  buttons: [{ text: 'Okay' }],
                })
                .then((alerEl) => {
                  alerEl.present();
                });
            }
          },
          (err) => {
            loadingEl.dismiss();
          }
        );
      });
  }

  goToSignup() {
    this.router.navigateByUrl('/signup');
  }
}
