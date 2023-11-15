import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-caption-modal',
  templateUrl: './edit-caption-modal.component.html',
  styleUrls: ['./edit-caption-modal.component.scss'],
})
export class EditCaptionModalComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}
  @Input('caption') caption;
  @Input('imageUrl') imageUrl;
  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss();
  }

  updateCaption() {
    this.modalCtrl.dismiss({ caption: this.caption });
  }
}
