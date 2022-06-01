import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  passwordsMatch = true;
  constructor(private router: Router) {}

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
  }
}
