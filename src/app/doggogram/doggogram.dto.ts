export interface AddPostDTO {
  userId: number;
  imageURL: string;
  caption: string;
}

export interface AddPostResponseDTO {
  id: number;
  userid: number;
  username: string;
  imageURL: string;
  caption: string;
  createdDate: Date;
  isPostAdded: boolean;
}

export interface AddCommentDTO {
  userid: number;
  postid: number;
  comment: string;
}

export interface ToggleLikeDTO {
  userid: number;
  postid: number;
}

export interface ToggleLikeResponseDTO {
  userId: number;
  postId: number;
  likeCount: number;
  isLiked: boolean;
}

export interface AddCommentDTO {
  userid: number;
  postid: number;
  comment: string;
}

export interface GetCommentResponseDTO {
  id: number;
  userid: number;
  username: string;
  postid: number;
  comment: string;
  createdDate: Date;
  isCommentAdded: boolean;
}

export interface GetPostsResponseDTO {
  id: number;
  userId: number;
  username: string;
  imageURL: string;
  caption: string;
  createdDate: Date;
  likesCount: number;
  isLiked: boolean;
  comments: GetCommentResponseDTO[];
}
