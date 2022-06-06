import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  authSub: Subscription;
  previousAuthState = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authSub = this.authService.isLoggedIn.subscribe((isLoggedIn) => {
      if (!isLoggedIn && this.previousAuthState !== isLoggedIn) {
        this.router.navigateByUrl('home');
      }
      this.previousAuthState = isLoggedIn;
    });
    this.loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPIKey}&libraries=places`
    ).then(() => {});
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = name;
      document.getElementsByTagName('head')[0].appendChild(script);
      console.log('Script Loaded');
      resolve(script);
    });
  }
}
