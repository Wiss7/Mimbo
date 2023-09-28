import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhoneCodesComponent } from 'src/app/shared/phone-codes/phone-codes.component';

@Component({
  selector: 'app-add-case',
  templateUrl: './add-case.page.html',
  styleUrls: ['./add-case.page.scss'],
})
export class AddCasePage implements OnInit {
  caseType: string;
  codeImage =
    'https://upload.wikimedia.org/wikipedia/commons/5/59/Flag_of_Lebanon.svg';
  selectedCode = '+961';
  selectedRegion = 'Lebanon';
  phoneNumber: string;
  region: string;
  details: string;
  images = [];
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  changeCountryCode() {
    this.modalCtrl
      .create({
        component: PhoneCodesComponent,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resData) => {
        if (resData.role === 'select') {
          const country = resData.data.country;
          this.selectedCode = country.number;
          this.selectedRegion = country.name;
          this.codeImage = country.flag;
        }
      });
  }

  save() {}
}
