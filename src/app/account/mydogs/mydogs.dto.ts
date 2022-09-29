export interface AddDogDTO {
  name: string;
  breed: string;
  dateOfBirth: string;
  gender: string;
  userId: number;
}

export interface AddDogResponseDTO {
  dogId: number;
  userId: number;
  name: string;
  breed: string;
  dateOfBirth: Date;
  gender: string;
  isDogAdded: boolean;
}

export interface UpdateDogDTO {
  id: number;
  name: string;
  breed: string;
  dateOfBirth: string;
  gender: string;
}

export interface GetDogResponseDTO {
  id: number;
  name: string;
  breed: string;
  dateOfBirth: Date;
  gender: string;
  imageUrl: string;
}
