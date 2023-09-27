export interface RegistrationDto {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneCode: string;
  phoneRegion: string;
  phoneNumber: string;
}

export interface RegistrationResponseDto {
  isRegistrationSuccessful: boolean;
  isUsernameUnique: boolean;
  isEmailUnique: boolean;
  token: string;
  error: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneRegion: string;
  phoneNumber: string;
  username: string;
  tokenExpirationDate: Date;
}

export interface LoginDTO {
  username: string;
  password: string;
}
export interface LoginResponseDTO {
  isLoginSuccessful: boolean;
  token: string;
  error: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneRegion: string;
  phoneNumber: string;
  username: string;
  tokenExpirationDate: Date;
}

export interface UpdateProfileDTO {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  phoneCode: string;
  phoneRegion: string;
  phoneNumber: string;
}

export interface UpdateProfileResponseDTO {
  isUpdateSuccessful: boolean;
  token: string;
  error: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneRegion: string;
  phoneNumber: string;
  username: string;
  tokenExpirationDate: Date;
}

export interface ChangePasswordDTO {
  email: string;
  newPassword: string;
  currentPassword: string;
}
