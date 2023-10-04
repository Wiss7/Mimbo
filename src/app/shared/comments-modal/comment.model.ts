export class Comment {
  constructor(
    public id: number,
    public userid: number,
    public username: string,
    public postid: number,
    public createdDate: Date,
    public comment: string
  ) {}
}
