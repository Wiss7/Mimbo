export class Reminder {
  constructor(
    public id: number,
    public dogId: number,
    public dogName: string,
    public reminderDateTime: Date,
    public remindMeBefore: number,
    public remindMe: boolean,
    public typeId: number,
    public notes: string,
    public typeImageName: string
  ) {}
}
