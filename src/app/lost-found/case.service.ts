import { Injectable } from '@angular/core';
import { AddCaseDTO, GetCaseResponseDTO } from './case.dto';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';
import { Case, CaseImage } from './case.model';
import {
  AddCommentDTO,
  GetCommentResponseDTO,
} from '../shared/comments-modal/comments.dto';
import { Comment } from '../shared/comments-modal/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  private _cases = new BehaviorSubject<Case[]>([]);
  casesArray = [];
  casesByUserArray = [];
  get cases() {
    return this._cases.asObservable();
  }

  constructor(private http: HttpClient) {}

  addCase(body: AddCaseDTO) {
    const url = environment.apiUrl + '/api/case/add';
    return this.http.post<boolean>(url, body);
  }

  getCases(lastItemId: number) {
    if (lastItemId === 0) this.casesArray = [];
    const url = environment.apiUrl + '/api/case/all/' + lastItemId;
    return this.http.get<GetCaseResponseDTO[]>(url).pipe(
      map((res) => {
        res.forEach((casee) => {
          const images: CaseImage[] = [];
          casee.images.forEach((image) => {
            images.push(
              new CaseImage(image.id, image['imageURL'], image['case'].id)
            );
          });
          this.casesArray.push(
            new Case(
              casee.id,
              casee.userId,
              casee.username,
              casee.fullName,
              casee.email,
              casee.type,
              casee.phoneNumber,
              casee.phoneCode,
              casee.phoneRegion,
              casee.location,
              casee.details,
              casee.dogName,
              casee.breed,
              casee.age,
              casee.medical,
              casee.size,
              casee.gender,
              [...images],
              casee.commentsCount,
              casee.createdDate,
              casee.isLastPost
            )
          );
        });
        return this.casesArray;
      }),
      tap((cases) => this._cases.next(cases))
    );
  }

  getComments(caseId: number) {
    const url = environment.apiUrl + '/api/case/comments/all/' + caseId;
    return this.http.get<GetCommentResponseDTO[]>(url).pipe(
      map((res) => {
        const postComments = [];
        res.forEach((comment) => {
          postComments.push(
            new Comment(
              comment.id,
              comment.userId,
              comment.username,
              comment.postId,
              comment.createdDate,
              comment.comment
            )
          );
        });
        return postComments;
      })
    );
  }

  deleteComment(commentId) {
    const url = environment.apiUrl + '/api/case/comments/delete/' + commentId;
    return this.http.delete<number>(url);
  }

  addComment(body: AddCommentDTO) {
    const url = environment.apiUrl + '/api/case/comment/add';
    return this.http.post<GetCommentResponseDTO>(url, body);
  }
}
