import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessagingService implements OnDestroy {
  userSub: Subscription;
  userId: number;
  constructor(
    private afMessaging: AngularFireMessaging,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  private requestPermission() {
    return this.afMessaging.requestPermission.pipe(take(1)).toPromise();
  }

  getToken() {
    return this.afMessaging.getToken.pipe(take(1)).toPromise();
  }

  async requestNotificationPermission() {
    try {
      const perm = await this.requestPermission();
      setTimeout(async () => {
        const token = await this.getToken();
        this.registerToken(token);
      }, 1000);
    } catch (error) {
      console.error('Unable to get permission to notify.', error);
    }
  }

  registerToken(token: string) {
    const url = environment.apiUrl + '/api/auth/registertoken';

    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        this.http
          .post(url, { userId: this.userId, token: token })
          .subscribe(() => {});
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
