import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Comment } from 'src/app/doggogram/comment.model';
import { AddCommentDTO } from 'src/app/doggogram/doggogram.dto';
import { DoggogramService } from 'src/app/doggogram/doggogram.service';

@Component({
  selector: 'app-comments-modal',
  templateUrl: './comments-modal.component.html',
  styleUrls: ['./comments-modal.component.css'],
})
export class CommentsModalComponent implements OnInit, OnDestroy {
  @Input() postid;
  @Input() userId;
  @Input() source;
  comments: Comment[] = [];
  NewComment = '';
  isLoading = true;
  commentsCount = 0;
  getCommentSub: Subscription;
  addCommentSub: Subscription;
  deleteCommentSub: Subscription;
  constructor(
    private modalCtrl: ModalController,
    private doggogramService: DoggogramService,
    private toastController: ToastController
  ) {
    this.NewComment = '';
  }
  ngOnInit() {
    this.getComments();
  }
  ngOnDestroy() {
    if (this.getCommentSub) this.getCommentSub.unsubscribe();
    if (this.addCommentSub) this.addCommentSub.unsubscribe();
    if (this.deleteCommentSub) this.deleteCommentSub.unsubscribe();
  }
  getComments() {
    if (this.source === 'doggogram') {
      this.getCommentSub = this.doggogramService
        .getComments(this.postid)
        .subscribe((comments) => {
          this.comments = comments;
          this.commentsCount = comments.length;
          this.isLoading = false;
        });
    }
  }
  onCancel() {
    this.modalCtrl.dismiss({
      commentsCount: this.commentsCount,
    });
  }
  addComment() {
    if (this.NewComment.trim().length === 0) {
      this.NewComment = '';
      return;
    }
    if (this.source === 'doggogram') {
      const addCommentDTO: AddCommentDTO = {
        comment: this.NewComment.trim(),
        postid: this.postid,
        userid: this.userId,
      };
      const commentToAdd = this.NewComment;
      this.NewComment = '';
      this.addCommentSub = this.doggogramService
        .addComment(addCommentDTO)
        .subscribe({
          next: async (res) => {
            if (res.isCommentAdded) {
              this.comments.push(
                new Comment(
                  res.id,
                  res.userId,
                  res.username,
                  res.postId,
                  res.createdDate,
                  res.comment
                )
              );
              this.commentsCount = this.comments.length;
            } else {
              const toast = await this.toastController.create({
                color: 'danger',
                duration: 2000,
                message: 'Could not perform action. Please try again later.',
              });
              await toast.present();
            }
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
  deleteComment(commentId: number) {
    const index = this.comments.findIndex((x) => x.id === commentId);
    const tempComment = this.comments[index];
    this.comments.splice(index, 1);
    this.commentsCount = this.comments.length;
    this.deleteCommentSub = this.doggogramService
      .deleteComment(commentId)
      .subscribe({
        next: async (res) => {
          this.commentsCount = res;
          const toast = await this.toastController.create({
            color: 'primary',
            duration: 2000,
            message: 'Comment deleted successfully.',
          });
          await toast.present();
        },
        error: async () => {
          this.comments.splice(index, 0, tempComment);
          this.commentsCount = this.comments.length;
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
