import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-comment-modal',
  templateUrl: './edit-comment-modal.component.html',
  styleUrls: ['./edit-comment-modal.component.scss'],
})
export class EditCommentModalComponent implements OnInit {
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
