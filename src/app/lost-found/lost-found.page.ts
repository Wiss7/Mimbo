import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CaseService } from './case.service';
import { Case } from './case.model';

@Component({
  selector: 'app-lost-found',
  templateUrl: './lost-found.page.html',
  styleUrls: ['./lost-found.page.scss'],
})
export class LostFoundPage implements OnInit, OnDestroy {
  casesSub: Subscription;
  casesHTTPSub: Subscription;
  isLoading = true;
  cases: Case[];
  HasMoreData = true;
  constructor(private caseService: CaseService) {}
  ngOnInit() {
    this.casesSub = this.caseService.cases.subscribe((cases) => {
      this.cases = cases;
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

  handleRefresh(event: any) {
    this.HasMoreData = true;
    this.casesHTTPSub = this.caseService.getCases(0).subscribe(() => {
      event.target.complete();
      this.isLoading = false;
    });
  }

  async ionViewWillEnter() {
    this.casesHTTPSub = this.caseService.getCases(0).subscribe(() => {
      this.isLoading = false;
    });
  }

  onIonInfinite(event: any) {
    this.casesHTTPSub = this.caseService
      .getCases(this.cases[this.cases.length - 1].id)
      .subscribe((res) => {
        const hasLastPost = this.cases.find((c) => c.isLastPost === true);
        if (hasLastPost === undefined) event.target.complete();
        else this.HasMoreData = false;
      });
  }
}
