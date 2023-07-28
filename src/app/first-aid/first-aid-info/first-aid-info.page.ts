import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-first-aid-info',
  templateUrl: './first-aid-info.page.html',
  styleUrls: ['./first-aid-info.page.scss'],
})
export class FirstAidInfoPage implements OnInit {
  type: string;
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.type = params.type;
    });
  }

  ngOnInit() {}
}
