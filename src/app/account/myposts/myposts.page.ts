import { Component, OnDestroy, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Subscription } from 'rxjs';
import { DoggogramService } from 'src/app/doggogram/doggogram.service';
import { Post } from 'src/app/doggogram/post.model';

@Component({
  selector: 'app-myposts',
  templateUrl: './myposts.page.html',
  styleUrls: ['./myposts.page.scss'],
})
export class MypostsPage implements OnInit, OnDestroy {
  isLoading = true;
  filter = 'doggogram';
  posts: Post[];
  userId = 0;
  postsSub: Subscription;
  postsHTTPSub: Subscription;
  constructor(private doggogramService: DoggogramService) {}

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

  async handleRefresh(event: any) {
    this.userId = await this.isLoggedIn();
    this.postsHTTPSub = this.doggogramService
      .getPostsByUser(this.userId)
      .subscribe(() => {
        event.target.complete();
      });
  }

  async ionViewWillEnter() {
    this.userId = await this.isLoggedIn();
    this.postsHTTPSub = this.doggogramService
      .getPostsByUser(this.userId)
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnInit() {
    this.postsSub = this.doggogramService.posts.subscribe((posts) => {
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    if (this.postsSub) {
      this.postsSub.unsubscribe();
    }
    if (this.postsHTTPSub) {
      this.postsHTTPSub.unsubscribe();
    }
  }

  filterPosts() {}
}
