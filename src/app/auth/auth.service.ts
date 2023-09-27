/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, tap, take, switchMap } from 'rxjs/operators';
import {
  ChangePasswordDTO,
  LoginDTO,
  LoginResponseDTO,
  RegistrationDto,
  RegistrationResponseDto,
  UpdateProfileDTO,
  UpdateProfileResponseDTO,
} from './auth.dto';
import { User } from './user.model';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = new BehaviorSubject<User>(null);
  constructor(private http: HttpClient) {}

  get isLoggedIn() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user._token;
        } else {
          return false;
        }
      })
    );
  }
  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user._token;
        } else {
          return null;
        }
      })
    );
  }

  get user() {
    return this._user.asObservable();
  }

  register(body: RegistrationDto) {
    const url = environment.apiUrl + '/api/auth/register';
    return this.http.post<RegistrationResponseDto>(url, body).pipe(
      tap((resp) => {
        if (resp.isRegistrationSuccessful === true) {
          const user = new User(
            resp.userId,
            resp.email,
            resp.phoneCode,
            resp.phoneRegion,
            resp.phoneNumber,
            resp.username,
            resp.firstName,
            resp.lastName,
            resp.token,
            resp.tokenExpirationDate
          );
          this.storeAuthData(user);
          this._user.next(user);
        }
      })
    );
  }

  login(body: LoginDTO) {
    const url = environment.apiUrl + '/api/auth/login';
    return this.http.post<LoginResponseDTO>(url, body).pipe(
      tap((resp) => {
        if (resp.isLoginSuccessful === true) {
          const user = new User(
            resp.userId,
            resp.email,
            resp.phoneCode,
            resp.phoneRegion,
            resp.phoneNumber,
            resp.username,
            resp.firstName,
            resp.lastName,
            resp.token,
            resp.tokenExpirationDate
          );
          this.storeAuthData(user);
          this._user.next(user);
        }
      })
    );
  }

  autoLogin() {
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
      tap((user) => {
        if (user) {
          this._user.next(user);
        }
      }),
      // eslint-disable-next-line arrow-body-style
      map((user) => {
        return !!user;
      })
    );
  }
  logout() {
    this._user.next(null);
    Preferences.remove({ key: 'authData' });
  }

  updateProfile(data: UpdateProfileDTO) {
    const url = environment.apiUrl + '/api/auth/update';
    return this.token.pipe(
      take(1),
      switchMap((res) => {
        const token = res;
        return this.http.post(url, data).pipe(
          tap((resp: UpdateProfileResponseDTO) => {
            const user = new User(
              resp.userId,
              resp.email,
              resp.phoneCode,
              resp.phoneRegion,
              resp.phoneNumber,
              resp.username,
              resp.firstName,
              resp.lastName,
              resp.token,
              resp.tokenExpirationDate
            );
            this.storeAuthData(user);
            this._user.next(user);
          })
        );
      })
    );
  }

  deleteProfile(id: number) {
    const url = environment.apiUrl + '/api/auth/delete?userId=' + id;
    return this.http.delete<boolean>(url);
  }

  resetPassword(email: string) {
    const url = environment.apiUrl + '/api/auth/resetpassword';
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    });

    const json = JSON.stringify(email);
    return this.http.post<boolean>(url, json, { headers });
  }

  changePassword(data: ChangePasswordDTO) {
    const url = environment.apiUrl + '/api/auth/changepassword';
    return this.http.post(url, data);
  }
  private storeAuthData(user: User) {
    Preferences.set({ key: 'authData', value: JSON.stringify(user) });
  }
}
