export interface RegistrationDto {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
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
  username: string;
  tokenExpirationDate: Date;
}
