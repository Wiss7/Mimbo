import { Component, OnInit } from '@angular/core';
import { countrycodes } from './countrycodes';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-phone-codes',
  templateUrl: './phone-codes.component.html',
  styleUrls: ['./phone-codes.component.scss'],
})
export class PhoneCodesComponent implements OnInit {
  countryCodes = [];
  filteredCodes = [];
  constructor(private modalCtrl: ModalController) {
    this.countryCodes = [...countrycodes];
    this.filteredCodes = [...this.countryCodes];
  }

  ngOnInit() {}

  onFilterChanged(searchBar) {
    this.filteredCodes = [
      ...this.countryCodes.filter(
        (b) =>
          b.name.toLowerCase().includes(searchBar.value.toLowerCase()) ||
          b.number.includes(searchBar.value.toLowerCase())
      ),
    ];
  }
  onClose() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  onSelect(country) {
    this.modalCtrl.dismiss({ country }, 'select');
  }
}
