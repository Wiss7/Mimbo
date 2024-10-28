import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonModal,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { AdminService } from '../admin.service';
import { Subscription } from 'rxjs';
import { GetFactsResponseDTO, UpdateFactDTO } from '../admin.dto';

@Component({
  selector: 'app-facts',
  templateUrl: './facts.page.html',
  styleUrls: ['./facts.page.scss'],
})
export class FactsPage implements OnInit, OnDestroy {
  addFactSub: Subscription;
  updateFactSub: Subscription;
  factsSub: Subscription;
  isLoading = true;
  filter = null;
  loadedFacts: GetFactsResponseDTO[];
  selectedFact: GetFactsResponseDTO;
  @ViewChild('factsModal') factsModal: IonModal;
  @ViewChild('updatefactModal') updatefactModal: IonModal;
  constructor(
    private adminService: AdminService,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.getFacts();
  }

  getFacts() {
    this.isLoading = true;
    this.factsSub = this.adminService.getAllFacts().subscribe((facts) => {
      this.loadedFacts = facts;
      this.isLoading = false;
    });
  }

  deleteFact(factId: number) {
    this.alertCtrl
      .create({
        header: 'Delete fact?',
        message:
          'Are you sure you wish to delete this fact? This action will delete related reminders and cannot be undone!',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              this.alertCtrl.dismiss();
            },
          },
          {
            text: 'Delete',
            cssClass: 'confirm-delete',
            handler: () => {
              this.performDelete(factId);
              this.alertCtrl.dismiss();
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  performDelete(factId: number) {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Please wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.adminService.deleteFact(factId).subscribe({
          next: (res) => {
            if (res) {
              const index = this.loadedFacts.findIndex((f) => f.id === factId);
              this.loadedFacts.splice(index, 1);
            }
            loadingEl.dismiss();
          },
          error: () => {
            loadingEl.dismiss();
          },
        });
      });
  }

  cancel() {
    this.factsModal.dismiss();
  }

  CancelUpdate() {
    this.updatefactModal.dismiss();
  }

  AddFact(fact: string) {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        showBackdrop: false,
        message: 'Please Wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.addFactSub = this.adminService.addFact(fact).subscribe({
          next: async (isAdded) => {
            if (!isAdded) {
              loadingEl.dismiss();
              this.alertCtrl
                .create({
                  header: 'An Error Occurred',
                  message:
                    'Could not perform this action at the moment. Please try again later.',
                  buttons: [{ text: 'Dismiss' }],
                })
                .then((alerEl) => {
                  loadingEl.dismiss();
                  alerEl.present();
                });
            } else {
              const toast = await this.toastController.create({
                color: 'primary',
                duration: 2000,
                message: 'Fact added successfully',
              });
              this.getFacts();
              loadingEl.dismiss();
              await toast.present();
              this.cancel();
            }
          },
          error: () => loadingEl.dismiss(),
        });
      });
  }

  ngOnDestroy() {
    if (this.addFactSub) this.addFactSub.unsubscribe();
    if (this.factsSub) this.factsSub.unsubscribe();
    if (this.updateFactSub) this.updateFactSub.unsubscribe();
  }

  UpdateFact(isSent: boolean, fact: string) {
    const updatedFact: UpdateFactDTO = {
      id: this.selectedFact.id,
      isSent,
      fact,
    };
    this.loadingCtrl
      .create({
        keyboardClose: true,
        showBackdrop: false,
        message: 'Please Wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.updateFactSub = this.adminService
          .updateFact(updatedFact)
          .subscribe({
            next: async (isAdded) => {
              if (!isAdded) {
                loadingEl.dismiss();
                this.alertCtrl
                  .create({
                    header: 'An Error Occurred',
                    message:
                      'Could not perform this action at the moment. Please try again later.',
                    buttons: [{ text: 'Dismiss' }],
                  })
                  .then((alerEl) => {
                    loadingEl.dismiss();
                    alerEl.present();
                  });
              } else {
                const toast = await this.toastController.create({
                  color: 'primary',
                  duration: 2000,
                  message: 'Fact updated successfully',
                });
                this.getFacts();
                loadingEl.dismiss();
                await toast.present();
                this.CancelUpdate();
              }
            },
            error: () => loadingEl.dismiss(),
          });
      });
  }
  ViewFact(factid: number) {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Please wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.factsSub = this.adminService
          .getFactById(factid)
          .subscribe((fact) => {
            this.selectedFact = fact;
            this.updatefactModal.present();
            loadingEl.dismiss();
          });
      });
  }
}
