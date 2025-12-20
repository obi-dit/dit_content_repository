export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
  token: string;
  refreshToken: string;
}
export enum Role {
  ADMIN = "admin",
  USER = "user",
}
export enum UserType {
  ADMIN = "admin",
  USER = "user",
  COMPANY_USER = "company_user",
}
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
}
