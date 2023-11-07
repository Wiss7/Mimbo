import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

@Injectable()
export class ErrorinterceptorInterceptor implements HttpInterceptor {
  constructor(private alertCtrl: AlertController, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let message = error.message;
        let logout = false;
        if (error.status === 401) {
          message = 'Login Expired! Log in again to perform this action.';
          Preferences.remove({ key: 'authData' });
          logout = true;
        } else if (error.status === 404) {
          message = 'Error 404! URL not found';
        } else if (error.status === 0) {
          message =
            'Make sure your internet connection is working and try again!';
        }
        this.alertCtrl
          .create({
            header: 'Oops!!',
            message,
            buttons: [
              {
                text: 'Dismiss',
                handler: () => {
                  if (logout) this.router.navigateByUrl('home');
                },
              },
            ],
          })
          .then((alerEl) => {
            alerEl.present();
          });
        return throwError(error);
      })
    );
  }
}
