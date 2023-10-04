export class Case {
  constructor(
    public id: number,
    public userid: number,
    public username: string,
    public type: string,
    public phoneNumber: string,
    public phoneCode: string,
    public phoneRegion: string,
    public location: string,
    public details: string,
    public images: CaseImage[],
    public commentsCount: number,
    public createdDate: Date,
    public isLastPost: boolean
  ) {}
}

export class CaseImage {
  constructor(public id: number, public url: string, public caseId: number) {}
}
