import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  constructor(private loadingCtrl: LoadingController, private router: Router) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Logging In',
      })
      .then((loadingEl) => loadingEl.present());

    setTimeout(() => {
      this.loadingCtrl.dismiss();
      this.router.navigateByUrl('/profile');
    }, 1000);
  }

  goToSignup() {
    this.router.navigateByUrl('/signup');
  }
}
