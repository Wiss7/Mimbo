import { Component, OnDestroy, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Subscription } from 'rxjs';
import { Case } from 'src/app/lost-found/case.model';
import { CaseService } from 'src/app/lost-found/case.service';

@Component({
  selector: 'app-mycases',
  templateUrl: './mycases.page.html',
  styleUrls: ['./mycases.page.scss'],
})
export class MycasesPage implements OnInit, OnDestroy {
  isLoading = true;
  cases: Case[];
  userId = 0;
  casesSub: Subscription;
  casesHTTPSub: Subscription;
  HasMoreData = true;
  constructor(private caseService: CaseService) {}

  async isLoggedIn() {
    const { value } = await Preferences.get({ key: 'authData' });
    if (value == null) {
      return -1;
    }
    const authData = JSON.parse(value);
    // if (authData.tokenExpirationDate <= new Date()) {
    //   return -1;
    // }
    return authData.id;
  }

  async handleRefresh(event: any) {
    this.userId = await this.isLoggedIn();
    this.casesHTTPSub = this.caseService
      .getCasesByUser(this.userId, 0)
      .subscribe(() => {
        event.target.complete();
      });
  }
  async ionViewWillEnter() {
    this.userId = await this.isLoggedIn();
    this.casesHTTPSub = this.caseService
      .getCasesByUser(this.userId, 0)
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnInit() {
    this.casesSub = this.caseService.cases.subscribe((posts) => {
      this.cases = posts;
      if (this.cases.length === 0) this.HasMoreData = false;
      else this.HasMoreData = true;
    });
  }

  ngOnDestroy() {
    if (this.casesSub) {
      this.casesSub.unsubscribe();
    }
    if (this.casesHTTPSub) {
      this.casesHTTPSub.unsubscribe();
    }
  }

  onIonInfinite(event: any) {
    this.casesHTTPSub = this.caseService
      .getCasesByUser(this.userId, this.cases[this.cases.length - 1].id)
      .subscribe((res) => {
        const hasLastPost = this.cases.find((p) => p.isLastPost === true);
        if (hasLastPost === undefined) event.target.complete();
        else this.HasMoreData = false;
      });
  }
}
