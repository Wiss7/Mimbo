import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { AppNotification } from './notification';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  @ViewChild('notificationForm', { static: false }) notificationForm: NgForm;
  notifSub: Subscription;
  constructor(
    private adminService: AdminService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    const { title, message, url, topic } = form.value;
    this.sendNotification(title, message, url, topic);
  }

  sendNotification(title, message, url, topic) {
    if (url == null) {
      url = '';
    }
    const appNotification: AppNotification = {
      Title: title,
      Content: message,
      URL: url,
      Topic: topic,
      Token: '',
    };
    this.loadingCtrl
      .create({
        keyboardClose: true,
        showBackdrop: false,
        message: 'Please wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.notifSub = this.adminService
          .sendNotification(appNotification)
          .subscribe({
            next: async (res) => {
              loadingEl.dismiss();
              if (res) {
                const toast = await this.toastCtrl.create({
                  color: 'primary',
                  duration: 2000,
                  message: 'Notification sent successfully.',
                });
                await toast.present();
                this.notificationForm.resetForm();
              } else {
                this.loadingCtrl.dismiss();
                this.alertCtrl
                  .create({
                    header: 'An Error Occured',
                    message: 'Could not send notification.',
                    buttons: [
                      {
                        text: 'Dismiss',
                        handler: () => {
                          this.alertCtrl.dismiss();
                        },
                      },
                    ],
                  })
                  .then((alertEl) => alertEl.present());
              }
            },
            error: () => loadingEl.dismiss(),
          });
      });
  }
}
