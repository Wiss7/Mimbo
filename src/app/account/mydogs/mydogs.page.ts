import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Dog } from './dog.model';
import { DogService } from './dogs.service';

@Component({
  selector: 'app-mydogs',
  templateUrl: './mydogs.page.html',
  styleUrls: ['./mydogs.page.scss'],
})
export class MydogsPage implements OnInit, OnDestroy {
  userSub: Subscription;
  dogsSub: Subscription;
  allDogsSub: Subscription;
  userId: number;
  isLoading = true;
  loadedDogs: Dog[];

  constructor(
    private authService: AuthService,
    private dogService: DogService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.dogsSub = this.dogService.dogs.subscribe((dogs) => {
      this.loadedDogs = dogs;
    });
  }
  ngOnDestroy() {
    if (this.dogsSub) {
      this.dogsSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.allDogsSub) {
      this.allDogsSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        this.allDogsSub = this.dogService
          .getAllDogs(this.userId)
          .subscribe(() => {
            this.isLoading = false;
          });
      }
    });
  }

  deleteDog(dogId: number) {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Please wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.dogService.deleteDog(dogId).subscribe(
          () => {
            loadingEl.dismiss();
          },
          () => {
            loadingEl.dismiss();
          }
        );
      });
  }
}
