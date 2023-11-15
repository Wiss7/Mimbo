import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from 'src/app/doggogram/post.model';
import { CommentsModalComponent } from '../comments-modal/comments-modal.component';
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { ToggleLikeDTO } from 'src/app/doggogram/doggogram.dto';
import { DoggogramService } from 'src/app/doggogram/doggogram.service';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { EditCaptionModalComponent } from './edit-caption-modal/edit-caption-modal.component';
import { AuthPopupComponent } from '../auth-popup/auth-popup.component';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit, OnDestroy {
  likeSub: Subscription;
  @Input('post') post: Post;
  @Input('posts') posts: Post[];
  @Input('userId') userId: number;
  hideDelete = true;
  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private doggogramService: DoggogramService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}
  ngOnInit() {
    this.hideDelete = this.router.url.toLowerCase().includes('doggogram');
  }
  formatDate(myDate: Date) {
    const format = 'dd-MMM-yyyy';
    const locale = 'en-US';
    const formattedDate = formatDate(myDate, format, locale).split(' ');
    return formattedDate[0];
  }
  ngOnDestroy() {
    if (this.likeSub) {
      this.likeSub.unsubscribe();
    }
  }
  ViewComments(postid: number) {
    if (this.userId <= 0) {
      this.openSignInPopup();
      return;
    }
    this.modalCtrl
      .create({
        component: CommentsModalComponent,
        componentProps: {
          postid,
          userId: this.userId,
          source: 'doggogram',
        },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          const index = this.posts.findIndex((p) => p.id === postid);
          this.posts[index].commentsCount = modalData.data['commentsCount'];
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

  ToggleLike(postid: number) {
    if (this.userId <= 0) {
      this.openSignInPopup();
      return;
    }
    const index = this.posts.findIndex((p) => p.id === postid);
    this.posts[index].isLiked = !this.posts[index].isLiked;
    if (this.posts[index].isLiked)
      this.posts[index].likesCount = this.posts[index].likesCount + 1;
    else this.posts[index].likesCount = this.posts[index].likesCount - 1;
    const toggleLikeDTO: ToggleLikeDTO = { postid, userid: this.userId };
    this.likeSub = this.doggogramService.toggleLike(toggleLikeDTO).subscribe({
      next: (res) => {
        this.posts[index].likesCount = res;
      },
      error: async () => {
        const toast = await this.toastController.create({
          color: 'danger',
          duration: 2000,
          message: 'Could not perform action. Please try again later.',
        });
        await toast.present();
      },
    });
  }

  deletePost(postId: number) {
    this.alertCtrl
      .create({
        header: 'Delete Post?',
        message:
          'Are you sure you wish to delete this post? This action cannot be undone!',
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
              this.performDelete(postId);
              this.alertCtrl.dismiss();
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  performDelete(postId: number) {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Please wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.doggogramService.deletePost(postId).subscribe({
          next: async (res) => {
            if (res) {
              const index = this.posts.findIndex((p) => p.id === postId);
              this.posts.splice(index, 1);
              loadingEl.dismiss();
              const toast = await this.toastController.create({
                color: 'primary',
                duration: 2000,
                message: 'Post deleted successfully.',
              });
              await toast.present();
            } else {
              loadingEl.dismiss();
              const toast = await this.toastController.create({
                color: 'danger',
                duration: 2000,
                message: 'Could not perform action. Please try again later.',
              });
              await toast.present();
            }
          },
          error: async () => {
            loadingEl.dismiss();
            const toast = await this.toastController.create({
              color: 'danger',
              duration: 2000,
              message: 'Could not perform action. Please try again later.',
            });
            await toast.present();
          },
        });
      });
  }

  editCaption(postId: number) {
    const index = this.posts.findIndex((p) => p.id === postId);
    const caption = this.posts[index].caption;
    const imageUrl = this.posts[index].imageUrl;
    this.modalCtrl
      .create({
        component: EditCaptionModalComponent,
        componentProps: {
          caption,
          imageUrl,
        },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          this.loadingCtrl
            .create({
              keyboardClose: true,
              message: 'Please wait...',
            })
            .then((loadingEl) => {
              loadingEl.present();
              const caption = modalData.data['caption'];
              this.doggogramService.updateComment(postId, caption).subscribe({
                next: async (res) => {
                  if (res) {
                    const index = this.posts.findIndex((p) => p.id === postId);
                    this.posts[index].caption = caption;
                    loadingEl.dismiss();
                    const toast = await this.toastController.create({
                      color: 'primary',
                      duration: 2000,
                      message: 'Caption updated successfully.',
                    });
                    await toast.present();
                  } else {
                    loadingEl.dismiss();
                    const toast = await this.toastController.create({
                      color: 'danger',
                      duration: 2000,
                      message:
                        'Could not perform action. Please try again later.',
                    });
                    await toast.present();
                  }
                },
                error: async () => {
                  loadingEl.dismiss();
                  const toast = await this.toastController.create({
                    color: 'danger',
                    duration: 2000,
                    message:
                      'Could not perform action. Please try again later.',
                  });
                  await toast.present();
                },
              });
            });
        });
        modalEl.present();
      });
  }
}
