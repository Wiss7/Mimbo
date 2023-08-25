export class Post {
  constructor(
    public id: number,
    public userid: number,
    public username: string,
    public caption: string,
    public imageUrl: string,
    public createdDate: Date,
    public likesCount: number,
    public isLiked: boolean,
    public comments: Comment[]
  ) {}
}
