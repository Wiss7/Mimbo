import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.page.html',
  styleUrls: ['./reminders.page.scss'],
})
export class RemindersPage implements OnInit {
  isLoading = false;
  filter = 'Upcoming';
  loadedReminders = [];
  constructor() {}

  ngOnInit() {}
}
