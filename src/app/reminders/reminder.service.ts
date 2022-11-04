import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AddReminderDTO, AddReminderResponseDTO } from './reminder.dto';

@Injectable({ providedIn: 'root' })
export class ReminderService {
  constructor(private http: HttpClient) {}
  addReminder(body: AddReminderDTO) {
    const url = environment.apiUrl + '/api/reminder/add';
    return this.http.post<AddReminderResponseDTO>(url, body);
  }
}
