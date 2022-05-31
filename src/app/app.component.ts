import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    this.loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPIKey}&libraries=places`
    ).then(() => {
      console.log('Success');
    });
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = name;
      document.getElementsByTagName('head')[0].appendChild(script);
      console.log('Script Loaded');
      resolve(script);
    });
  }
}
