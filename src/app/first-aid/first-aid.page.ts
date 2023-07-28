import { Component, OnInit } from '@angular/core';
import { firstAidList } from './firstAidList';
@Component({
  selector: 'app-first-aid',
  templateUrl: './first-aid.page.html',
  styleUrls: ['./first-aid.page.scss'],
})
export class FirstAidPage implements OnInit {
  firstAidNames: string[];
  constructor() {}

  ngOnInit() {
    this.firstAidNames = firstAidList;
  }
}
