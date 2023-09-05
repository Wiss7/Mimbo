import { Component, OnDestroy, OnInit } from '@angular/core';
import { Camera } from '@capacitor/camera';
import {
  CameraResultType,
  CameraSource,
} from '@capacitor/camera/dist/esm/definitions';

import { Capacitor } from '@capacitor/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
  ViewWillEnter,
} from '@ionic/angular';
import { ImageCropperComponent } from '../shared/image-cropper/image-cropper.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Post } from './post.model';
import { DoggogramService } from './doggogram.service';
import { AddPostDTO } from './doggogram.dto';

@Component({
  selector: 'app-doggogram',
  templateUrl: './doggogram.page.html',
  styleUrls: ['./doggogram.page.scss'],
})
export class DoggogramPage implements OnInit, OnDestroy, ViewWillEnter {
  uploadedImage: string;
  postsSub: Subscription;
  postsHTTPSub: Subscription;
  addPostSub: Subscription;
  userSub: Subscription;
  isLoading = true;
  posts: Post[];
  userId = 0;
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private alertCtrl: AlertController,
    private doggogramService: DoggogramService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.postsSub = this.doggogramService.posts.subscribe((posts) => {
      this.posts = posts;
    });
  }

  async ionViewWillEnter() {
    this.userId = await this.isLoggedIn();
    this.postsHTTPSub = this.doggogramService
      .getPosts(this.userId)
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ShowLoginAlert() {
    this.alertCtrl
      .create({
        header: 'Sign In Reqiured',
        message: 'You need to sign in before uploading a photo of your doggo',
        buttons: [
          {
            text: 'Dismiss',
            handler: () => {
              this.alertCtrl.dismiss();
            },
          },
          {
            text: 'Sign in',
            handler: () => {
              this.router.navigateByUrl('/signin');
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  async isLoggedIn() {
    const { value } = await Preferences.get({ key: 'authData' });
    if (value == null) {
      return -1;
    }
    const authData = JSON.parse(value);
    if (authData.tokenExpirationDate <= new Date()) {
      return -1;
    }
    return authData.id;
  }
  async onPickImageFromCamera(from: string) {
    if ((await this.isLoggedIn()) < 0) {
      this.ShowLoginAlert();
      return;
    }
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }
    let source: any;
    if (from === 'Camera') {
      source = CameraSource.Camera;
    } else {
      source = CameraSource.Photos;
    }

    Camera.getPhoto({
      quality: 70,
      source,
      correctOrientation: true,
      resultType: CameraResultType.Base64,
      allowEditing: false,
    })
      .then((image) => {
        this.uploadedImage = image.base64String;
        this.openImageCropper();
      })
      .catch((err) => {});
  }

  openImageCropper() {
    this.modalCtrl
      .create({
        component: ImageCropperComponent,
        componentProps: {
          uploadedImage: 'data:image/png;base64, ' + this.uploadedImage,
        },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          var caption = modalData.data['caption'];
          var imageUrl = modalData.data['imageUrl'];
          this.uploadPost(caption, imageUrl);
        });
        modalEl.present();
      });
  }
  uploadPost(caption: string, imageURL: string) {
    const addPostDTO: AddPostDTO = {
      userId: this.userId,
      caption,
      imageURL,
    };

    this.loadingCtrl
      .create({
        keyboardClose: true,
        showBackdrop: false,
        message: 'Please Wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.addPostSub = this.doggogramService.addPost(addPostDTO).subscribe({
          next: async (res) => {
            if (!res.isPostAdded) {
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
                message: 'Post added successfully',
              });
              this.posts.unshift(
                new Post(
                  res.id,
                  res.userid,
                  res.username,
                  res.caption,
                  res.imageURL,
                  res.createdDate,
                  0,
                  false,
                  0
                )
              );
              loadingEl.dismiss();
              await toast.present();
            }
          },
          error: () => loadingEl.dismiss(),
        });
      });
  }

  ngOnDestroy() {
    if (this.postsSub) {
      this.postsSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.postsHTTPSub) {
      this.postsHTTPSub.unsubscribe();
    }
    if (this.addPostSub) {
      this.addPostSub.unsubscribe();
    }
  }
}
