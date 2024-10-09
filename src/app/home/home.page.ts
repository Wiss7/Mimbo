import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../shared/services/messaging.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  showNotificationButton: boolean;

  constructor(private messagingService: MessagingService) {}
  ngOnInit() {
    this.showNotificationButton = Notification.permission != 'granted';
  }
  async requestNotificationPermission() {
    await this.messagingService.requestNotificationPermission();
    setTimeout(() => {
      this.showNotificationButton = Notification.permission != 'granted';
    }, 2000);
  }
}
