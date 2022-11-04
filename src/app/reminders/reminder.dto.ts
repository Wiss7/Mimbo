export interface AddReminderDTO {
  dogId: number;
  userId: number;
  typeId: number;
  reminderDate: Date;
  remindBefore: number;
  notes: string;
}

export interface AddReminderResponseDTO {
  id: number;
  dogId: number;
  reminderDate: Date;
  typeId: number;
  remindBefore: number;
  isReminderAdded: boolean;
  notes: string;
}
