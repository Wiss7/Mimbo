import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { foodlist } from '../foodlist';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  foodType: string;
  foodList = [];
  selectedFood;
  isLoading = false;
  imageUrl: string;
  answerText: string;
  answerClass: string;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private aletCtrl: AlertController
  ) {}
  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe((paramMap: Params) => {
      if (!paramMap.name) {
        this.navCtrl.navigateBack('/edible');
        return;
      }
      this.foodType = paramMap.name;
      this.foodList = foodlist;
      this.selectedFood = this.foodList.find(
        (f) =>
          f.name.trim().toLowerCase() === this.foodType.trim().toLowerCase()
      );
      if (!this.selectedFood) {
        this.aletCtrl
          .create({
            header: 'An Error Occured',
            message: 'This food does not exist. Select one from the list.',
            buttons: [
              {
                text: 'Dismiss',
                handler: () => this.navCtrl.navigateBack('/edible'),
              },
            ],
          })
          .then((alerEl) => alerEl.present());
      } else {
        switch (this.selectedFood.edible.trim().toLowerCase()) {
          case 'yes':
            this.imageUrl = '../../assets/images/foodlist/Yes.png';
            this.answerText =
              'Yes, It is perfectly safe for your dog to eat it.';
            this.answerClass = 'success';
            break;
          case 'no':
            this.imageUrl = '../../assets/images/foodlist/No.png';
            this.answerText =
              'NO AMOUNT IS SAFE. Make sure to keep it away from your dog.';
            this.answerClass = 'danger';
            break;
          default:
            this.imageUrl = '../../assets/images/foodlist/Moderate.png';
            this.answerText =
              // eslint-disable-next-line max-len
              'It can be used as an occasional treat. However, feeding your dog frequently or in large amounts could cause health problems.';
            this.answerClass = 'warning';
        }
      }
      this.isLoading = false;
    });
  }
}
