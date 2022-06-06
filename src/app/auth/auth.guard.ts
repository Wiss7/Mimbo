import { Injectable } from '@angular/core';
import {
  Router,
  Route,
  UrlSegment,
  CanLoad,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap, take, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.authService.isLoggedIn.pipe(
      take(1),
      switchMap((isLoggedIn) => {
        if (!isLoggedIn) {
          return this.authService.autoLogin();
        } else {
          return of(isLoggedIn);
        }
      }),
      tap((isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigateByUrl('/signin');
        }
      })
    );
  }
}
