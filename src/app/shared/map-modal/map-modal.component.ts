import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapElementRef: ElementRef;
  @Input() center = { lat: -34.379, lng: 150.644 };
  clickListener: any;
  googleMaps: any;
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private renderer: Renderer2
  ) {}

  ngOnInit() {}
  onCancel() {
    this.modalCtrl.dismiss();
  }
  ngAfterViewInit() {
    this.getGoogleMaps()
      .then((googleMaps) => {
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement;
        const map = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 16,
        });

        this.googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });

        this.clickListener = map.addListener('click', (event) => {
          const selectedCoords = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          this.modalCtrl.dismiss(selectedCoords);
        });
        const marker = new googleMaps.Marker({
          position: this.center,
          // eslint-disable-next-line object-shorthand
          map: map,
          title: 'Picked Location',
        });
        marker.setMap(map);
      })
      .catch((err) => {
        this.alertCtrl.create({
          header: 'Could Not Load Maps',
          message:
            'Google maps is not available at the moment. Please try again later!',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.modalCtrl.dismiss();
              },
            },
          ],
        });
      });
  }
  ngOnDestroy() {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }
  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleMapsAPIKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Maps SDK is not available');
        }
      };
    });
  }
}
