import { CaseImage } from './case.model';

export interface AddCaseDTO {
  type: string;
  userId: number;
  phoneNumber: string;
  phoneCode: string;
  phoneRegion: string;
  location: string;
  details: string;
  images: string[];
}

export interface GetCaseResponseDTO {
  id: number;
  type: string;
  userId: number;
  username: string;
  phoneNumber: string;
  phoneCode: string;
  phoneRegion: string;
  location: string;
  details: string;
  images: CaseImage[];
  createdDate: Date;
  commentsCount: number;
  isLastPost: boolean;
}
