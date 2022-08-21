import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthinterceptorInterceptor implements HttpInterceptor, OnDestroy {
  tokenSubscription: Subscription;
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.tokenSubscription = this.authService.token.subscribe((res) => {
      if (res) {
        console.log('success', res);
        return next.handle(request);
      }
    });
    return next.handle(request);
  }
  ngOnDestroy() {
    if (this.tokenSubscription) {
      this.tokenSubscription.unsubscribe();
    }
  }
}
