import { Injectable } from '@angular/core';
import { Router, Route, UrlSegment, CanLoad } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap, take, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private router: Router, private authService: AuthService) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn.pipe(
      take(1),
      switchMap((isLoggedIn) => {
        if (!isLoggedIn) {
          return this.authService.autoLogin();
        } else {
          return of(isLoggedIn);
        }
      }),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigateByUrl('/signin');
        }
      })
    );
  }
}
