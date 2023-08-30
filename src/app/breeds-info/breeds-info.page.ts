import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { identity, Subscription } from 'rxjs';
import { BreedInfo } from './breed-info.model';
import { BreedListComponent } from './breed-list/breed-list.component';

@Component({
  selector: 'app-breeds-info',
  templateUrl: './breeds-info.page.html',
  styleUrls: ['./breeds-info.page.scss'],
})
export class BreedsInfoPage implements OnInit, OnDestroy {
  isLoading = false;
  breedsList = [];
  selectedBreed: BreedInfo;
  breedSubscription: Subscription;
  constructor(
    private alerCtrl: AlertController,
    private router: Router,
    private http: HttpClient,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.breedSubscription = this.http
      .get('https://api.thedogapi.com/v1/breeds?page=0&limit=1000', {
        headers: { 'x-api-key': 'e2c31cf2-a9e7-45f9-95b9-13818f0a9959' },
      })
      .subscribe({
        next: (res: any) => {
          this.breedsList = res;
          this.randomizeBreed();
        },
        error: () => {
          this.alerCtrl.create({
            header: 'Woof! Woof!',
            message: 'An error occured!! Please try again later.',
            buttons: [
              {
                text: 'Dismiss',
                handler: () => {
                  this.isLoading = false;
                  this.router.navigate(['/home']);
                },
              },
            ],
          });
        },
      });
  }

  randomizeBreed() {
    this.isLoading = true;
    if (this.breedsList && this.breedsList.length > 0) {
      const index = Math.floor(Math.random() * this.breedsList.length);
      const listItem = this.breedsList[index];
      this.selectedBreed = new BreedInfo(
        listItem.id,
        listItem.name,
        listItem.bred_for ? listItem.bred_for : '',
        listItem.breed_group ? listItem.breed_group : '',
        listItem.life_span ? listItem.life_span : '',
        listItem.temperament ? listItem.temperament : '',
        listItem.origin ? listItem.origin : '',
        listItem.weight.metric ? listItem.weight.metric : '',
        listItem.weight.imperial ? listItem.weight.imperial : '',
        listItem.height.metric ? listItem.height.metric : '',
        listItem.height.imperial ? listItem.height.imperial : '',
        listItem.image.url ? listItem.image.url : ''
      );
      this.isLoading = false;
    }
  }

  selectBreed() {
    this.modalCtrl
      .create({
        component: BreedListComponent,
        componentProps: { breedsList: this.breedsList },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resData) => {
        if (resData.role === 'select') {
          const breedId = resData.data.breedId;
          const index = this.breedsList.findIndex((b) => b.id === breedId);
          const listItem = this.breedsList[index];
          this.selectedBreed = new BreedInfo(
            listItem.id,
            listItem.name,
            listItem.bred_for ? listItem.bred_for : '',
            listItem.breed_group ? listItem.breed_group : '',
            listItem.life_span ? listItem.life_span : '',
            listItem.temperament ? listItem.temperament : '',
            listItem.origin ? listItem.origin : '',
            listItem.weight.metric ? listItem.weight.metric : '',
            listItem.weight.imperial ? listItem.weight.imperial : '',
            listItem.height.metric ? listItem.height.metric : '',
            listItem.height.imperial ? listItem.height.imperial : '',
            listItem.image.url ? listItem.image.url : ''
          );
        }
      });
  }
  ngOnDestroy() {
    if (this.breedSubscription) {
      this.breedSubscription.unsubscribe();
    }
  }
}
