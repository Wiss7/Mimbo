import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { iif, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { reminderTypes } from './reminder-types/reminderTypes';
import { Reminder } from './reminder.model';
import { ReminderService } from './reminder.service';
@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.page.html',
  styleUrls: ['./reminders.page.scss'],
})
export class RemindersPage implements OnInit, OnDestroy {
  userSub: Subscription;
  allRemindersSub: Subscription;
  reminderSub: Subscription;
  isLoading = true;
  filter = 'All';
  loadedReminders: Reminder[];
  allReminders: Reminder[];
  userId = 0;
  reminderTypes = [];
  constructor(
    private authService: AuthService,
    private reminderService: ReminderService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnDestroy() {
    if (this.allRemindersSub) {
      this.allRemindersSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.reminderSub) {
      this.reminderSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.reminderTypes = [...reminderTypes];
    this.reminderSub = this.reminderService.reminders.subscribe((reminders) => {
      this.allReminders = reminders;
      this.filterReminders();
    });
  }
  filterReminders() {
    if (this.filter === 'All') {
      this.loadedReminders = [...this.allReminders];
    } else if (this.filter === 'Upcoming') {
      this.loadedReminders = [
        ...this.allReminders.filter(
          (r) => new Date(r.reminderDateTime) >= new Date()
        ),
      ];
    } else if (this.filter === 'Past') {
      this.loadedReminders = [
        ...this.allReminders.filter(
          (r) => new Date(r.reminderDateTime) < new Date()
        ),
      ];
      console.log(this.loadedReminders);
    }
  }
  ionViewWillEnter() {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        this.allRemindersSub = this.reminderService
          .getAllReminders(this.userId)
          .subscribe(() => {
            this.isLoading = false;
          });
      }
    });
  }

  formatDateTime(myDate: Date) {
    const format = 'dd-MMM-yyyy h:mm a';
    const locale = 'en-US';
    const formattedDate = formatDate(myDate, format, locale).split(' ');
    return (
      formattedDate[0] + ' At ' + formattedDate[1] + ' ' + formattedDate[2]
    );
  }
  getTypeName(typeId: number) {
    return reminderTypes.find((r) => r.id === typeId.toString()).name;
  }
  deleteReminder(reminderId: number) {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Please wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.reminderService.deleteReminder(reminderId).subscribe(
          () => {
            loadingEl.dismiss();
          },
          () => {
            loadingEl.dismiss();
          }
        );
      });
  }
}