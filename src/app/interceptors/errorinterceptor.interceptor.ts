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

@Injectable()
export class ErrorinterceptorInterceptor implements HttpInterceptor {
  constructor(private alertCtrl: AlertController) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let message = error.message;
        if (error.status === 401) {
          message = 'Unathorized request! Log in to perform this action.';
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
            buttons: [{ text: 'Dismiss' }],
          })
          .then((alerEl) => {
            alerEl.present();
          });
        return throwError(error);
      })
    );
  }
}
