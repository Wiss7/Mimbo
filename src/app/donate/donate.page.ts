import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { ngos } from './NGOs';
@Component({
  selector: 'app-donate',
  templateUrl: './donate.page.html',
  styleUrls: ['./donate.page.scss'],
})
export class DonatePage implements OnInit {
  constructor() {}

  ngOnInit() {}

  async visit(name: string) {
    const i = ngos.findIndex((x) => x.name === name);
    const url = ngos[i].visitLink;
    await Browser.open({ url });
  }

  async donate(name: string) {
    console.log(ngos);
    const i = ngos.findIndex((x) => x.name === name);
    const url = ngos[i].donateLink;
    await Browser.open({ url });
  }
}
