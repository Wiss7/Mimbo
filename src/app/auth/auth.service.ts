/* eslint-disable no-underscore-dangle */
import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, tap } from 'rxjs/operators';
import {
  LoginDTO,
  LoginResponseDTO,
  RegistrationDto,
  RegistrationResponseDto,
} from './auth.dto';
import { User } from './user.model';
import { Storage } from '@capacitor/storage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = new BehaviorSubject<User>(null);
  constructor(private http: HttpClient) {}

  get isLoggedIn() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.token;
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
  register(body: RegistrationDto) {
    const url = environment.apiUrl + '/api/auth/register';
    return this.http.post<RegistrationResponseDto>(url, body).pipe(
      tap((resp) => {
        if (resp.isRegistrationSuccessful === true) {
          const user = new User(
            resp.userId,
            resp.email,
            resp.username,
            resp.firstName,
            resp.lastName,
            resp.token,
            resp.tokenExpirationDate
          );
          this._user.next(user);
          this.storeAuthData(user);
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
            resp.username,
            resp.firstName,
            resp.lastName,
            resp.token,
            resp.tokenExpirationDate
          );
          this._user.next(user);
          this.storeAuthData(user);
        }
      })
    );
  }

  autoLogin() {
    return from(Storage.get({ key: 'authData' })).pipe(
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
      map((user) => !!user)
    );
  }
  logout() {
    this._user.next(null);
  }

  private storeAuthData(user: User) {
    Storage.set({ key: 'authData', value: JSON.stringify(user) });
  }
}
