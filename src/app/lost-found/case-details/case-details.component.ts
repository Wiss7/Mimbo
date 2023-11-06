import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss'],
})
export class CaseDetailsComponent implements OnInit {
  @Input() selectedCase;
  caseType: string;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    switch (this.selectedCase.type) {
      case 'adoption': {
        this.caseType = 'FOR ADOPTION';
        break;
      }
      case 'lost': {
        this.caseType = 'LOST PET';
        break;
      }
      case 'found': {
        this.caseType = 'FOUND PET';
        break;
      }
      case 'foster': {
        this.caseType = 'FOSTER NEEDED';
        break;
      }
      case 'cashdonation': {
        this.caseType = 'CASH DONATION NEEDED';
        break;
      }
      case 'supplies': {
        this.caseType = 'Pet Supplies Donation Needed';
        break;
      }
      case 'report': {
        this.caseType = 'CRUELTY REPORT';
        break;
      }

      default: {
        this.caseType = 'OTHER';
        break;
      }
    }
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
