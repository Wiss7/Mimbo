import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VetsInfo } from '../vetsInfo.model';

@Component({
  selector: 'app-opening-hours',
  templateUrl: './opening-hours.component.html',
  styleUrls: ['./opening-hours.component.scss'],
})
export class OpeningHoursComponent implements OnInit {
  @Input() vet: VetsInfo;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onClose() {
    this.modalCtrl.dismiss();
  }
}
