export interface AddDogDTO {
  name: string;
  breed: string;
  dateOfBirth: string;
  gender: string;
  userId: number;
  imageUrl: string;
  isCastrated: boolean;
}

export interface AddDogResponseDTO {
  dogId: number;
  userId: number;
  name: string;
  breed: string;
  dateOfBirth: Date;
  gender: string;
  imageUrl: string;
  isCastrated: boolean;
  isDogAdded: boolean;
}

export interface UpdateDogDTO {
  id: number;
  name: string;
  breed: string;
  dateOfBirth: string;
  gender: string;
  imageUrl: string;
  isCastrated: boolean;
}

export interface GetDogResponseDTO {
  id: number;
  name: string;
  breed: string;
  dateOfBirth: Date;
  gender: string;
  imageUrl: string;
  isCastrated: boolean;
}
