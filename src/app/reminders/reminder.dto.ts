export interface AddReminderDTO {
  dogId: number;
  userId: number;
  typeId: number;
  reminderDate: Date;
  remindBefore: number;
  repeatEvery: number;
  notes: string;
}

export interface AddReminderResponseDTO {
  id: number;
  dogId: number;
  reminderDate: Date;
  typeId: number;
  remindBefore: number;
  repeatEvery: number;
  isReminderAdded: boolean;
  notes: string;
}

export interface UpdateReminderDTO {
  id: number;
  dogId: number;
  userId: number;
  typeId: number;
  reminderDate: Date;
  remindBefore: number;
  repeatEvery: number;
  notes: string;
}
