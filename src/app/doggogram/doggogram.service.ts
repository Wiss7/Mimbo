import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { Post } from './post.model';
import { Comment } from './comment.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  AddCommentDTO,
  AddPostDTO,
  AddPostResponseDTO,
  GetCommentResponseDTO,
  GetPostsResponseDTO,
  ToggleLikeDTO,
  ToggleLikeResponseDTO,
} from './doggogram.dto';

@Injectable({ providedIn: 'root' })
export class DoggogramService {
  private _posts = new BehaviorSubject<Post[]>([]);
  get posts() {
    return this._posts.asObservable();
  }

  constructor(private http: HttpClient) {}

  getPosts(userId: number) {
    const url = environment.apiUrl + '/api/doggogram/post/all/' + userId;
    return this.http.get<GetPostsResponseDTO[]>(url).pipe(
      map((res) => {
        const posts = [];
        res.forEach((post) => {
          const postComments = [];
          post.comments
            .filter((item) => item.postid === post.id)
            .forEach((comment) => {
              postComments.push(
                new Comment(
                  comment.id,
                  comment.userid,
                  comment.username,
                  comment.postid,
                  comment.createdDate,
                  comment.comment
                )
              );
            });
          posts.push(
            new Post(
              post.id,
              post.userId,
              post.username,
              post.caption,
              post.imageURL,
              post.createdDate,
              post.likesCount,
              post.isLiked,
              postComments
            )
          );
        });
        return posts;
      }),
      tap((posts) => this._posts.next(posts))
    );
  }

  addPost(body: AddPostDTO) {
    const url = environment.apiUrl + '/api/doggogram/post/add';
    return this.http.post<AddPostResponseDTO>(url, body);
  }
  addComment(body: AddCommentDTO) {
    const url = environment.apiUrl + '/api/post/comment/add';
    return this.http.post<GetCommentResponseDTO>(url, body);
  }

  toggleLike(body: ToggleLikeDTO) {
    const url = environment.apiUrl + '/api/doggogram/post/like';
    return this.http.post<number>(url, body);
  }
}
