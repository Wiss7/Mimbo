export interface GetFactsResponseDTO {
  id: number;
  fact: string;
  isSent: boolean;
  sentDate: Date;
}

export interface UpdateFactDTO {
  id: number;
  fact: string;
  isSent: boolean;
}
