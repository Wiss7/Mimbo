import { CaseImage } from './case.model';

export interface AddCaseDTO {
  type: string;
  userId: number;
  email: string;
  phoneNumber: string;
  phoneCode: string;
  phoneRegion: string;
  location: string;
  details: string;
  images: string[];
  dogName: string;
  breed: string;
  age: number;
  medical: string;
  size: string;
  gender: string;
}

export interface GetCaseResponseDTO {
  id: number;
  type: string;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  phoneCode: string;
  phoneRegion: string;
  location: string;
  details: string;
  images: CaseImage[];
  createdDate: Date;
  commentsCount: number;
  isLastPost: boolean;
  dogName: string;
  breed: string;
  age: number;
  medical: string;
  size: string;
  gender: string;
}
