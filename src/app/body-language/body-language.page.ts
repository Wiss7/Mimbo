import { Component, OnInit } from '@angular/core';
import { bodylanguage } from './bodyLanguage';

@Component({
  selector: 'app-body-language',
  templateUrl: './body-language.page.html',
  styleUrls: ['./body-language.page.scss'],
})
export class BodyLanguagePage implements OnInit {
  actionList: { action: string; meaning: string }[];
  constructor() {}

  ngOnInit() {
    this.actionList = bodylanguage;
  }
}
