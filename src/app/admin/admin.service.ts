import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppNotification } from './notifications/notification';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}
  sendNotification(appNotification: AppNotification) {
    const url = environment.apiUrl + '/api/notification/send';
    return this.http.post<boolean>(url, appNotification);
  }
}
