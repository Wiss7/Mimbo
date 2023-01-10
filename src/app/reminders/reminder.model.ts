export class Reminder {
  constructor(
    public id: number,
    public dogId: number,
    public dogName: string,
    public reminderDateTime: Date,
    public remindMeBefore: number,
    public remindMe: boolean,
    public repeatEvery: number,
    public typeId: number,
    public isComplete: boolean,
    public notes: string,
    public typeImageName: string
  ) {}
}
