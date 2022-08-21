import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { catchError, take, tap } from 'rxjs/operators';
import { Subscription, pipe } from 'rxjs';
import { UpdateProfileDTO, UpdateProfileResponseDTO } from '../auth/auth.dto';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  user: User;
  userId: number;
  userSub: Subscription;
  updateSub: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.authService.user
      .pipe(
        take(1),
        tap((user) => {
          this.user = user;
          this.email = user.email;
          this.username = user.username;
          this.firstName = user.firstName;
          this.lastName = user.lastName;
          this.userId = user.id;
        })
      )
      .subscribe();
  }
  logout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
  updateProfile() {
    const dto: UpdateProfileDTO = {
      id: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
    };
    this.updateSub = this.authService.updateProfile(dto).subscribe(
      (res) => {
        console.log('success');
      },
      () => {
        console.log('error');
      }
    );
  }
  deleteProfile() {}
}
