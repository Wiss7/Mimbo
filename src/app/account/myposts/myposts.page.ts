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
  posts: Post[];
  userId = 0;
  postsSub: Subscription;
  postsHTTPSub: Subscription;
  HasMoreData = true;
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
      .getPostsByUser(this.userId, 0)
      .subscribe(() => {
        event.target.complete();
      });
  }

  async ionViewWillEnter() {
    this.userId = await this.isLoggedIn();
    this.postsHTTPSub = this.doggogramService
      .getPostsByUser(this.userId, 0)
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnInit() {
    this.postsSub = this.doggogramService.posts.subscribe((posts) => {
      this.posts = posts;
      if (this.posts.length === 0) this.HasMoreData = false;
      else this.HasMoreData = true;
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

  onIonInfinite(event: any) {
    this.postsHTTPSub = this.doggogramService
      .getPostsByUser(this.userId, this.posts[this.posts.length - 1].id)
      .subscribe((res) => {
        const hasLastPost = this.posts.find((p) => p.isLastPost === true);
        if (hasLastPost === undefined) event.target.complete();
        else this.HasMoreData = false;
      });
  }

  filterPosts() {}
}
