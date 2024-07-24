import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth/auth.service';
import { register } from 'swiper/element/bundle';
import { MessagingService } from './shared/services/messaging.service';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  authSub: Subscription;
  previousAuthState = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private messagingService: MessagingService,
    private afMessaging: AngularFireMessaging
  ) {}

  async ngOnInit() {
    this.authSub = this.authService.isLoggedIn.subscribe((isLoggedIn) => {
      if (!isLoggedIn && this.previousAuthState !== isLoggedIn) {
        this.router.navigateByUrl('home');
      }
      this.previousAuthState = isLoggedIn;
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('firebase-messaging-sw.js')
        .then((registration) => {
          console.log(
            'Service Worker registered with scope:',
            registration.scope
          );
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    await this.loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPIKey}&libraries=places&loading=async`
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
      resolve(script);
    });
  }
}
