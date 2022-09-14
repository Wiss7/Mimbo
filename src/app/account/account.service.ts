import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SendMessageDTO } from './profile/account.dto';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(private http: HttpClient) {}
  sendMessage(body: SendMessageDTO) {
    const url = environment.apiUrl + '/api/account/contactus';
    return this.http.post(url, body);
  }
}
