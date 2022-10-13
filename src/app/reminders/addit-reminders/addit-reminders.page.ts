import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addit-reminders',
  templateUrl: './addit-reminders.page.html',
  styleUrls: ['./addit-reminders.page.scss'],
})
export class AdditRemindersPage implements OnInit {
  title = 'Add New Event';
  eventId = 0;
  isLoading = true;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.eventId = +this.activatedRoute.snapshot.params.id;
    if (this.eventId > 0) {
      this.title = 'Edit Event';
    } else {
      this.isLoading = false;
    }
  }
  save(f: NgForm) {}
}
