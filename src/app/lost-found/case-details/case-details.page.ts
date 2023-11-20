import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CaseService } from '../case.service';
import { Case } from '../case.model';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.page.html',
  styleUrls: ['./case-details.page.scss'],
})
export class CaseDetailsPage implements OnInit {
  selectedCase: Case;
  caseType: string;
  isLoading = true;
  constructor(
    private caseService: CaseService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const caseId = +this.activatedRoute.snapshot.params.id;
    this.caseService.getCaseById(caseId).subscribe((res) => {
      this.selectedCase = res;
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
      this.isLoading = false;
    });
  }
}
