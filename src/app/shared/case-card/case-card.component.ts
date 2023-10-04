import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Case } from 'src/app/lost-found/case.model';
import { CommentsModalComponent } from '../comments-modal/comments-modal.component';
import { AuthPopupComponent } from '../auth-popup/auth-popup.component';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-case-card',
  templateUrl: './case-card.component.html',
  styleUrls: ['./case-card.component.scss'],
})
export class CaseCardComponent implements OnInit {
  @Input('casee') casee: Case;
  @Input('cases') cases: Case[];
  hideDelete = true;
  caseType = '';
  userId = 0;
  constructor(private router: Router, private modalCtrl: ModalController) {}

  async ngOnInit() {
    this.userId = await this.isLoggedIn();
    this.hideDelete = this.router.url.toLowerCase().includes('lost-found');
    switch (this.casee.type) {
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

  async isLoggedIn() {
    const { value } = await Preferences.get({ key: 'authData' });
    if (value == null) {
      return -1;
    }
    const authData = JSON.parse(value);
    if (authData.tokenExpirationDate <= new Date()) {
      return -1;
    }
    return authData.id;
  }
  formatDate(myDate: Date) {
    const format = 'dd-MMM-yyyy';
    const locale = 'en-US';
    const formattedDate = formatDate(myDate, format, locale).split(' ');
    return formattedDate[0];
  }

  ViewComments(caseId: number) {
    if (this.userId <= 0) {
      this.openSignInPopup();
      return;
    }
    this.modalCtrl
      .create({
        component: CommentsModalComponent,
        componentProps: {
          caseId,
          userId: this.userId,
          source: 'case',
        },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          const index = this.cases.findIndex((c) => c.id === caseId);
          this.cases[index].commentsCount = modalData.data['commentsCount'];
        });
        modalEl.present();
      });
  }

  openSignInPopup() {
    this.modalCtrl
      .create({
        component: AuthPopupComponent,
        showBackdrop: true,
        cssClass: 'small-modal',
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          this.userId = modalData.data['userId'];
        });
        modalEl.present();
      });
  }
}
