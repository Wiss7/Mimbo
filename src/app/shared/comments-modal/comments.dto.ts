export interface AddCommentDTO {
  userid: number;
  postid: number;
  comment: string;
}
export interface AddCommentDTO {
  userid: number;
  postid: number;
  comment: string;
}

export interface GetCommentResponseDTO {
  id: number;
  userId: number;
  username: string;
  postId: number;
  comment: string;
  createdDate: Date;
  isCommentAdded: boolean;
}
