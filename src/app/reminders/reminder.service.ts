/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { reminderTypes } from './reminder-types/reminderTypes';
import {
  AddReminderDTO,
  AddReminderResponseDTO,
  UpdateReminderDTO,
} from './reminder.dto';
import { Reminder } from './reminder.model';

@Injectable({ providedIn: 'root' })
export class ReminderService {
  reminderTypes = [];
  private _reminders = new BehaviorSubject<Reminder[]>([]);
  constructor(private http: HttpClient) {
    this.reminderTypes = [...reminderTypes];
  }
  get reminders() {
    return this._reminders.asObservable();
  }
  addReminder(body: AddReminderDTO) {
    const url = environment.apiUrl + '/api/reminder/add';
    return this.http.post<AddReminderResponseDTO>(url, body);
  }

  getReminderById(reminderId: number) {
    const url = environment.apiUrl + '/api/reminder/get/' + reminderId;
    return this.http.get<Reminder>(url);
  }

  getAllReminders(userId: number) {
    const url = environment.apiUrl + '/api/reminder/all/' + userId;
    return this.http.get<Reminder[]>(url).pipe(
      map((res) => {
        const reminders = [];
        res.forEach((reminder) => {
          const typeImageName = this.reminderTypes.find(
            (r) => r.id === reminder.typeId.toString()
          ).imageName;
          reminders.push(
            new Reminder(
              reminder.id,
              reminder.dogId,
              reminder.dogName,
              reminder.reminderDateTime,
              reminder.remindMeBefore,
              reminder.remindMe,
              reminder.repeatEvery,
              reminder.typeId,
              reminder.isComplete,
              reminder.notes,
              typeImageName
            )
          );
        });
        return reminders;
      }),
      tap((reminders) => this._reminders.next(reminders))
    );
  }

  deleteReminder(reminderId: number) {
    const url = environment.apiUrl + '/api/reminder/delete/' + reminderId;
    return this.http.delete<Reminder[]>(url).pipe(
      map((res) => {
        const reminders = [];
        res.forEach((reminder) => {
          const typeImageName = this.reminderTypes.find(
            (r) => r.id === reminder.typeId.toString()
          ).imageName;
          reminders.push(
            new Reminder(
              reminder.id,
              reminder.dogId,
              reminder.dogName,
              reminder.reminderDateTime,
              reminder.remindMeBefore,
              reminder.remindMe,
              reminder.repeatEvery,
              reminder.typeId,
              reminder.isComplete,
              reminder.notes,
              typeImageName
            )
          );
        });
        return reminders;
      }),
      tap((reminders) => this._reminders.next(reminders))
    );
  }

  updateReminder(body: UpdateReminderDTO) {
    const url = environment.apiUrl + '/api/reminder/update';
    return this.http.post(url, body);
  }

  setComplete(reminderId: number) {
    const url = environment.apiUrl + '/api/reminder/complete/' + reminderId;
    return this.http.post(url, null);
  }
}
