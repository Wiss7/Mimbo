import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { getMode } from '@ionic/core';
import { PlaceLocation } from '../../../vets-near-by/location.model';
import { of } from 'rxjs';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationSet = new EventEmitter<{ lat: number; lng: number }>();
  pickedLocation: PlaceLocation;
  constructor(
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (!this.pickedLocation) {
      this.locateUser();
    }
  }
  onPickLocation() {
    this.actionSheetCtrl
      .create({
        header: 'Set Location',
        buttons: [
          {
            text: 'Use Current Location',
            handler: () => {
              this.locateUser();
            },
          },
          {
            text: 'Pick on Map',
            handler: () => {
              this.openMap();
            },
          },
          { text: 'Cancel', handler: () => {} },
        ],
      })
      .then((actionSheetEl) => actionSheetEl.present());
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showError();
      return;
    }
    Geolocation.getCurrentPosition()
      .then((geoPosition) => {
        this.pickedLocation = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude,
          address: null,
          staticMapImageUrl: null,
        };
        this.setImageAfterLocationChange();
      })
      .catch((err) => {
        this.showError();
      });
  }
  private showError() {
    this.alertCtrl
      .create({
        header: 'Could not fetch location',
        message: 'Please use the map to pick a location.',
        buttons: [{ text: 'Okay' }],
      })
      .then((alertEl) => alertEl.present());
  }
  private openMap() {
    let mapCenter;
    if (this.pickedLocation) {
      mapCenter = {
        lat: this.pickedLocation.lat,
        lng: this.pickedLocation.lng,
      };
    } else {
      mapCenter = { lat: -34.379, lng: 150.644 };
    }
    this.modalCtrl
      .create({
        component: MapModalComponent,
        componentProps: { center: mapCenter },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          this.pickedLocation = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
            address: null,
            staticMapImageUrl: null,
          };
          this.setImageAfterLocationChange();
        });
        modalEl.present();
      });
  }

  private setImageAfterLocationChange() {
    this.getAddress(this.pickedLocation.lat, this.pickedLocation.lng)
      .pipe(
        switchMap((address) => {
          this.pickedLocation.address = address;
          return of(
            this.getMapImage(
              this.pickedLocation.lat,
              this.pickedLocation.lng,
              14
            )
          );
        })
      )
      .subscribe((imageUrl) => {
        this.pickedLocation.staticMapImageUrl = imageUrl;
        this.locationSet.emit({
          lat: this.pickedLocation.lat,
          lng: this.pickedLocation.lng,
        });
      });
  }
  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPIKey}`
      )
      .pipe(
        map((geoData: any) => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapsAPIKey}`;
  }
}
