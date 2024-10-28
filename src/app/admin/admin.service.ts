import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppNotification } from './notifications/notification';
import { GetFactsResponseDTO, UpdateFactDTO } from './admin.dto';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}
  sendNotification(appNotification: AppNotification) {
    const url = environment.apiUrl + '/api/notification/send';
    return this.http.post<boolean>(url, appNotification);
  }
  addFact(fact: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.apiUrl + '/api/admin/add/fact';
    return this.http.post<boolean>(url, JSON.stringify(fact), { headers });
  }

  updateFact(updatedFact: UpdateFactDTO) {
    const url = environment.apiUrl + '/api/admin/update/fact';
    return this.http.post<boolean>(url, updatedFact);
  }

  getAllFacts() {
    const url = environment.apiUrl + '/api/admin/facts';
    return this.http.get<GetFactsResponseDTO[]>(url);
  }

  getFactById(factId: number) {
    const url = environment.apiUrl + '/api/admin/fact/' + factId;
    return this.http.get<GetFactsResponseDTO>(url);
  }

  deleteFact(factId: number) {
    const url = environment.apiUrl + '/api/admin/delete/fact/' + factId;
    return this.http.delete<boolean>(url);
  }
}
