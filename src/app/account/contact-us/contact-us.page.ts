import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AlertController,
  IonInput,
  IonTextarea,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AccountService } from '../account.service';
import { SendMessageDTO } from '../profile/account.dto';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit, OnDestroy {
  @ViewChild('title') titleInput: IonInput;
  @ViewChild('message') messageInput: IonTextarea;
  userSub: Subscription;
  userId: number;
  sendSub: Subscription;
  constructor(
    private alertCtrl: AlertController,
    private accountService: AccountService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });
  }
  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.sendSub) {
      this.sendSub.unsubscribe();
    }
  }

  sendMessage(title, message) {
    if (!message || message.trim().length === 0) {
      this.alertCtrl
        .create({
          message: 'Cannot send empty message',
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
    } else {
      this.loadingCtrl
        .create({
          keyboardClose: true,
          showBackdrop: false,
          message: 'Please Wait...',
        })
        .then((loadingEl) => {
          loadingEl.present();
          const data: SendMessageDTO = { userId: this.userId, title, message };
          this.sendSub = this.accountService.sendMessage(data).subscribe(
            async (res) => {
              loadingEl.dismiss();
              this.messageInput.value = '';
              this.titleInput.value = '';
              if (res) {
                const toast = await this.toastCtrl.create({
                  color: 'primary',
                  duration: 2000,
                  message: 'Message Sent Successfully!',
                });
                await toast.present();
              } else {
                this.alertCtrl
                  .create({
                    header: 'An Error Occured',
                    message:
                      'We cannot perform this action at the moment. Please try again later.',
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
            (err) => loadingEl.dismiss()
          );
        });
    }
  }
}
