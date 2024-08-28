/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Dog } from './dog.model';
import {
  AddDogDTO,
  AddDogResponseDTO,
  GetDogResponseDTO,
  UpdateDogDTO,
} from './mydogs.dto';
@Injectable({ providedIn: 'root' })
export class DogService {
  private _dogs = new BehaviorSubject<Dog[]>([]);
  constructor(private http: HttpClient) {}
  get dogs() {
    return this._dogs.asObservable();
  }
  addDog(body: AddDogDTO) {
    const url = environment.apiUrl + '/api/dog/add';
    return this.http.post<AddDogResponseDTO>(url, body);
  }

  updateDog(body: UpdateDogDTO) {
    const url = environment.apiUrl + '/api/dog/update';
    return this.http.post(url, body);
  }

  getAllDogs(userId: number) {
    const url = environment.apiUrl + '/api/dog/all/' + userId;
    return this.http.get<GetDogResponseDTO[]>(url).pipe(
      map((res) => {
        const dogs = [];
        res.forEach((dog) => {
          dogs.push(
            new Dog(
              dog.id,
              dog.name,
              dog.breed,
              dog.gender,
              dog.dateOfBirth,
              dog.imageUrl,
              dog.isCastrated
            )
          );
        });
        return dogs;
      }),
      tap((dogs) => this._dogs.next(dogs))
    );
  }

  deleteDog(dogId: number) {
    const url = environment.apiUrl + '/api/dog/delete/' + dogId;
    return this.http.delete<GetDogResponseDTO[]>(url).pipe(
      map((res) => {
        const dogs = [];
        res.forEach((dog) => {
          dogs.push(
            new Dog(
              dog.id,
              dog.name,
              dog.breed,
              dog.gender,
              dog.dateOfBirth,
              dog.imageUrl,
              dog.isCastrated
            )
          );
        });
        return dogs;
      }),
      tap((dogs) => this._dogs.next(dogs))
    );
  }

  getDogById(dogId: number) {
    const url = environment.apiUrl + '/api/dog/getdog/' + dogId;
    return this.http.get<GetDogResponseDTO>(url);
  }
}
