/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { AlertController, ModalController } from '@ionic/angular';
import { VetsInfo } from './vetsInfo.model';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { OpeningHoursComponent } from './opening-hours/opening-hours.component';
declare let google;
@Component({
  selector: 'app-vets-near-by',
  templateUrl: './vets-near-by.page.html',
  styleUrls: ['./vets-near-by.page.scss'],
})
export class VetsNearByPage implements OnInit {
  isLocationSelected = false;
  isLoading = false;
  vetsDetails: VetsInfo[] = [];
  service: any;
  currentLocation: { lat: number; lng: number };
  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private IAB: InAppBrowser,
    private callNumber: CallNumber,
    private modalCtrl: ModalController
  ) {}
  ngOnInit() {}
  findVets(event: any) {
    this.isLocationSelected = true;
    this.isLoading = true;
    this.currentLocation = { lat: event.lat, lng: event.lng };
    this.loadVetsFromMaps(event.lat, event.lng);
  }

  goToDirections(dest: { lat: number; lng: number }) {
    // eslint-disable-next-line max-len
    const directions = `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${this.currentLocation.lat},${this.currentLocation.lng}&destination=${dest.lat},${dest.lng}`;
    this.IAB.create(directions);
  }
  callVet(phoneNumber: string) {
    this.callNumber.callNumber(phoneNumber, true);
  }
  goToWebsite(website: string) {
    this.IAB.create(website);
  }
  viewOpeningHours(vetInfo: VetsInfo) {
    this.modalCtrl
      .create({
        component: OpeningHoursComponent,
        componentProps: { vet: vetInfo },
      })
      .then((modalEl) => {
        modalEl.present();
      });
  }
  private loadVetsFromMaps(lat: number, lng: number) {
    this.service = new google.maps.places.PlacesService(
      document.createElement('div')
    );
    this.service.nearbySearch(
      {
        location: { lat, lng },
        type: ['veterinary_care'],
        rankBy: google.maps.places.RankBy.DISTANCE,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          if (results.length > 0) {
            this.getVetDetails(0, results);
          } else {
            this.isLoading = false;
          }
        } else {
          this.alertCtrl
            .create({
              header: 'Could not fetch data',
              message: 'Please try again later or try a different location.',
              buttons: [{ text: 'Dismiss' }],
            })
            .then((alerEl) => {
              this.isLoading = false;
              alerEl.present();
            });
        }
      }
    );
  }

  private getVetDetails(index, results) {
    setTimeout(() => {
      const request = {
        placeId: results[index].place_id,
        fields: [
          'place_id',
          'name',
          'formatted_phone_number',
          'opening_hours',
          'rating',
          'user_ratings_total',
          'website',
        ],
      };
      this.service.getDetails(request, (placeData) => {
        const vet: VetsInfo = {
          vetId: placeData.place_id,
          name: placeData.name,
          openingHours: placeData.opening_hours?.weekday_text,
          phoneNumber: placeData.formatted_phone_number,
          rating: placeData.rating,
          ratingsTotal: placeData.user_ratings_total,
          website: placeData.website,
          location: {
            lat: results[index].geometry.location.lat(),
            lng: results[index].geometry.location.lng(),
          },
        };
        this.vetsDetails.push(vet);
        this.isLoading = false;
        index++;

        if (index < results.length) {
          this.getVetDetails(index, results);
        } else {
          this.isLoading = false;
        }
      });
    }, 300);
  }
}
