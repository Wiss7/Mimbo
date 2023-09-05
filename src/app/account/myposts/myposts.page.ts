import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myposts',
  templateUrl: './myposts.page.html',
  styleUrls: ['./myposts.page.scss'],
})
export class MypostsPage implements OnInit {
  isLoading = true;
  filter = 'doggogram';
  constructor() {}

  ngOnInit() {}

  filterPosts() {}
}
