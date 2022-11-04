import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonModal,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { reminderTypes } from '../reminder-types/reminderTypes';
import { OverlayEventDetail } from '@ionic/core/components';
import { formatDate, Time } from '@angular/common';
import { Dog } from 'src/app/account/mydogs/dog.model';
import { DogService } from 'src/app/account/mydogs/dogs.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AddReminderDTO } from '../reminder.dto';
import { ReminderService } from '../reminder.service';
@Component({
  selector: 'app-addit-reminders',
  templateUrl: './addit-reminders.page.html',
  styleUrls: ['./addit-reminders.page.scss'],
})
export class AdditRemindersPage implements OnInit, OnDestroy {
  @ViewChild('typePopup') typeModal: IonModal;
  @ViewChild('datepopup') dateModal: IonModal;
  @ViewChild('dogPopup') dogModal: IonModal;
  dogsSub: Subscription;
  userSub: Subscription;
  allDogsSub: Subscription;
  addReminderSub: Subscription;
  title = 'Add New Event';
  eventId = 0;
  typeId = 0;
  userId = 0;
  isLoading = true;
  reminderType = '';
  reminderTypes = [];
  loadedDogs: Dog[];
  reminderDate: string;
  datePopupVal: Date;
  dateToday: string;
  dogName = '';
  dogId = 0;
  reminderMins = '0';
  notes: '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dogService: DogService,
    private authService: AuthService,
    private reminderService: ReminderService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.dogsSub = this.dogService.dogs.subscribe((dogs) => {
      this.loadedDogs = dogs;
    });
  }
  ngOnDestroy() {
    if (this.dogsSub) {
      this.dogsSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.allDogsSub) {
      this.allDogsSub.unsubscribe();
    }
    if (this.addReminderSub) {
      this.addReminderSub.unsubscribe();
    }
  }
  ionViewWillEnter() {
    this.dateToday = new Date().toISOString();
    this.reminderTypes = [...reminderTypes];
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        this.allDogsSub = this.dogService
          .getAllDogs(this.userId)
          .subscribe(() => {
            this.eventId = +this.activatedRoute.snapshot.params.id;
            if (this.eventId > 0) {
              this.title = 'Edit Event';
            } else {
              this.isLoading = false;
            }
          });
      }
    });
  }

  cancelDate() {
    this.dateModal.dismiss(null, 'cancel');
  }
  cancelType() {
    this.typeModal.dismiss(null, 'cancel');
  }
  cancelDog() {
    this.dogModal.dismiss(null, 'cancel');
  }

  setType(id: number) {
    this.typeModal.dismiss(id, 'confirm');
  }
  setDate() {
    this.dateModal.dismiss(this.datePopupVal, 'confirm');
  }
  setDog(id: number) {
    this.dogModal.dismiss(id, 'confirm');
  }
  onTypeWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.typeId = +ev.detail.data;
      this.reminderType = this.reminderTypes.find(
        (r) => r.id === this.typeId.toString()
      ).name;
    }
  }

  onDateWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      let myDate;
      if (ev.detail.data) {
        myDate = ev.detail.data;
      } else {
        myDate = new Date().toISOString();
      }
      const format = 'dd-MMM-yyyy h:mm a';
      const locale = 'en-US';
      const formattedDate = formatDate(myDate, format, locale).split(' ');
      this.reminderDate =
        formattedDate[0] + ' At ' + formattedDate[1] + ' ' + formattedDate[2];
    }
  }

  onDogWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.dogId = +ev.detail.data;
      this.dogName = this.loadedDogs.find((r) => r.id === this.dogId).name;
    }
  }

  addNewDog() {
    this.cancelDog();
    this.router.navigateByUrl('/account/mydogs/addit-dog?fromReminder=1');
  }
  save(f: NgForm) {
    const addReminderDTO: AddReminderDTO = {
      dogId: this.dogId,
      userId: this.userId,
      remindBefore: +this.reminderMins,
      reminderDate: this.datePopupVal,
      typeId: this.typeId,
      notes: this.notes,
    };
    this.loadingCtrl
      .create({
        keyboardClose: true,
        showBackdrop: false,
        message: 'Deleting...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.addReminderSub = this.reminderService
          .addReminder(addReminderDTO)
          .subscribe(
            async (res) => {
              if (!res.isReminderAdded) {
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
                  message: 'Added successfully',
                });
                loadingEl.dismiss();
                await toast.present();
                this.router.navigate(['/reminders']);
              }
            },
            () => loadingEl.dismiss()
          );
      });
  }
}
