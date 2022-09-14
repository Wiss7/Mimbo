/* eslint-disable no-underscore-dangle */
import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { from, Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';
import { User } from '../auth/user.model';
import { map, switchMap } from 'rxjs/operators';
@Injectable()
export class AuthinterceptorInterceptor implements HttpInterceptor, OnDestroy {
  tokenSubscription: Subscription;
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.indexOf(environment.apiUrl) === -1) {
      return next.handle(request);
    }
    return from(Preferences.get({ key: 'authData' })).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const user = JSON.parse(storedData.value) as User;
        if (user.tokenExpirationDate <= new Date()) {
          return null;
        }
        return user;
      }),
      switchMap((user) => {
        if (!user) {
          return next.handle(request);
        } else {
          if (!user._token) {
            return next.handle(request);
          } else {
            request = request.clone({
              setHeaders: { authorization: `Bearer ${user._token}` },
            });
            return next.handle(request);
          }
        }
      })
    );
  }
  ngOnDestroy() {
    if (this.tokenSubscription) {
      this.tokenSubscription.unsubscribe();
    }
  }
}
