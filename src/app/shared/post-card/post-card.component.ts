import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from 'src/app/doggogram/post.model';
import { CommentsModalComponent } from '../comments-modal/comments-modal.component';
import { ModalController, ToastController } from '@ionic/angular';
import { ToggleLikeDTO } from 'src/app/doggogram/doggogram.dto';
import { DoggogramService } from 'src/app/doggogram/doggogram.service';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

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
  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private doggogramService: DoggogramService
  ) {}
  ngOnInit() {}
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
    const index = this.posts.findIndex((p) => p.id === postid);
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

  ToggleLike(postid: number) {
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
}
