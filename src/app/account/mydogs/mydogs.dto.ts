export interface AddDogDTO {
  name: string;
  breed: string;
  dateOfBirth: string;
  gender: string;
  userId: number;
  imageUrl: string;
}

export interface AddDogResponseDTO {
  dogId: number;
  userId: number;
  name: string;
  breed: string;
  dateOfBirth: Date;
  gender: string;
  imageUrl: string;
  isDogAdded: boolean;
}

export interface UpdateDogDTO {
  id: number;
  name: string;
  breed: string;
  dateOfBirth: string;
  gender: string;
  imageUrl: string;
}

export interface GetDogResponseDTO {
  id: number;
  name: string;
  breed: string;
  dateOfBirth: Date;
  gender: string;
  imageUrl: string;
}
