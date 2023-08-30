import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
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
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
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
    this.alertCtrl
      .create({
        header: 'Delete Dog?',
        message:
          'Are you sure you wish to delete this dog? This action will delete related reminders and cannot be undone!',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              this.alertCtrl.dismiss(dogId);
            },
          },
          {
            text: 'Delete',
            cssClass: 'confirm-delete',
            handler: () => {
              this.performDelete(dogId);
              this.alertCtrl.dismiss();
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  performDelete(dogId: number) {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Please wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.dogService.deleteDog(dogId).subscribe({
          next: () => {
            loadingEl.dismiss();
          },
          error: () => {
            loadingEl.dismiss();
          },
        });
      });
  }
}
